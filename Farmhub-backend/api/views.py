from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Land, Bid, Payment
from .serializers import (
    LandSerializer, LandCreateSerializer,
    BidSerializer, BidCreateSerializer,
    PaymentSerializer,
)
from .utils import initiate_stk_push, send_winner_email


@api_view(['GET'])
@permission_classes([AllowAny])
def api_overview(request):
    return Response({
        'message': 'FarmHub API is running',
        'endpoints': {
            'Register':     '/api/auth/register/',
            'Login':        '/api/auth/login/',
            'Profile':      '/api/auth/profile/',
            'Listings':     '/api/listings/',
            'My Listings':  '/api/listings/mine/',
            'Create Land':  '/api/listings/create/',
            'Bids':         '/api/bids/',
            'My Bids':      '/api/bids/mine/',
            'My Payments':  '/api/payments/mine/',
            'My Summary':   '/api/summary/',
        }
    })


# ── LISTINGS ──────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listing_list(request):
    # Include both available and pending (auction ended but not yet leased)
    lands = Land.objects.filter(status__in=['available', 'pending'])

    county = request.query_params.get('county')
    if county and county != 'all':
        lands = lands.filter(county=county)

    search = request.query_params.get('search', '')
    if search:
        from django.db.models import Q
        lands = lands.filter(
            Q(title__icontains=search) | Q(location__icontains=search)
        )

    amenities = request.query_params.get('amenities', '')
    if amenities:
        for a in amenities.split(','):
            a = a.strip()
            if a == 'has_water':       lands = lands.filter(has_water=True)
            if a == 'has_electricity': lands = lands.filter(has_electricity=True)
            if a == 'has_road_access': lands = lands.filter(has_road_access=True)
            if a == 'has_fencing':     lands = lands.filter(has_fencing=True)
            if a == 'has_irrigation':  lands = lands.filter(has_irrigation=True)

    min_acres = request.query_params.get('min_acres')
    max_acres = request.query_params.get('max_acres')
    if min_acres:
        lands = lands.filter(size_acres__gte=min_acres)
    if max_acres:
        lands = lands.filter(size_acres__lte=max_acres)

    sort = request.query_params.get('sort', 'newest')
    if sort == 'price_low':  lands = lands.order_by('price_kes')
    if sort == 'price_high': lands = lands.order_by('-price_kes')
    if sort == 'size':       lands = lands.order_by('-size_acres')
    if sort == 'newest':     lands = lands.order_by('-created_at')

    serializer = LandSerializer(lands, many=True, context={'request': request})
    return Response(serializer.data)


from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import parser_classes

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def listing_create(request):
    serializer = LandCreateSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_listings(request):
    lands = Land.objects.filter(owner=request.user)
    serializer = LandSerializer(lands, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def listing_detail(request, pk):
    try:
        land = Land.objects.get(pk=pk)
    except Land.DoesNotExist:
        return Response({'error': 'Land not found'}, status=404)

    if request.method == 'GET':
        serializer = LandSerializer(land, context={'request': request})
        return Response(serializer.data)

    if land.owner != request.user:
        return Response({'error': 'Not authorised'}, status=403)

    if request.method == 'PUT':
        serializer = LandCreateSerializer(land, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(LandSerializer(land, context={'request': request}).data)

    if request.method == 'DELETE':
        land.delete()
        return Response({'message': 'Deleted'}, status=204)


# ── BIDS ──────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def place_bid(request):
    serializer = BidCreateSerializer(data=request.data, context={'request': request})
    serializer.is_valid(raise_exception=True)
    bid = serializer.save()
    return Response(BidSerializer(bid).data, status=201)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_bids(request):
    bids = Bid.objects.filter(bidder=request.user).select_related('land')
    return Response(BidSerializer(bids, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def land_bids(request, land_id):
    bids = Bid.objects.filter(land_id=land_id).order_by('-amount_kes')
    return Response(BidSerializer(bids, many=True).data)


# ── PAYMENTS ──────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_payments(request):
    payments = Payment.objects.filter(user=request.user)
    return Response(PaymentSerializer(payments, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_summary(request):
    user = request.user
    return Response({
        'listings_count':  Land.objects.filter(owner=user).count(),
        'bids_count':      Bid.objects.filter(bidder=user).count(),
        'payments_count':  Payment.objects.filter(user=user).count(),
        'active_bids':     Bid.objects.filter(bidder=user, status='leading').count(),
        'won_bids':        Bid.objects.filter(bidder=user, status='won').count(),
    })

# ── PAYMENTS ──

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def initiate_payment(request, land_id):
    try:
        land = Land.objects.get(pk=land_id)
        # Find leading bid
        leading_bid = land.bids.first()
        if not leading_bid or leading_bid.bidder != request.user:
            return Response({'error': 'You are not the winner'}, status=403)

        phone = request.data.get('phone', request.user.phone)
        print(f"DEBUG: Initiating STK Push for {phone}, Amount: {leading_bid.amount_kes}")
        result = initiate_stk_push(phone, leading_bid.amount_kes, land.title)
        print(f"DEBUG: STK Push Result: {result}")
        
        # Create a pending payment record
        Payment.objects.create(
            user=request.user,
            land=land,
            amount_kes=leading_bid.amount_kes,
            payment_type='lease',
            description=f"STK Push initiated for {land.title}"
        )
        
        return Response(result)
    except Land.DoesNotExist:
        return Response({'error': 'Land not found'}, status=404)

@api_view(['POST'])
@permission_classes([AllowAny])
def mpesa_callback(request):
    """
    Handles Safaricom STK Push callback.
    """
    data = request.data
    print(f"DEBUG: M-Pesa Callback received: {data}")
    
    # Simple logic to extract result
    # In production, use more robust parsing for 'Body' -> 'stkCallback'
    try:
        body = data.get('Body', {}).get('stkCallback', {})
        result_code = body.get('ResultCode')
        merchant_request_id = body.get('MerchantRequestID')
        
        # Find the most recent pending payment for this user (or use MerchantID if stored)
        # For simplicity in this demo, we'll mark the latest pending payment as completed if code is 0
        if result_code == 0:
            # Success
            # We would typically use a unique transaction ID here
            # For now, let's find the land associated with the last pending payment
            payment = Payment.objects.filter(status='pending').first()
            if payment:
                payment.status = 'completed'
                payment.mpesa_ref = body.get('CallbackMetadata', {}).get('Item', [{}])[1].get('Value', 'REF-MPESA')
                payment.save()
                
                # Mark land as leased
                land = payment.land
                if land:
                    land.status = 'leased'
                    land.save()
                    print(f"DEBUG: Land {land.id} successfully leased via M-Pesa")
        
        return Response({"ResultCode": 0, "ResultDesc": "Success"})
    except Exception as e:
        print(f"DEBUG: Callback Error: {str(e)}")
        return Response({"ResultCode": 1, "ResultDesc": "Internal Error"}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def close_auction(request, land_id):
    # This would typically be a background task, but we'll add a manual trigger for now
    try:
        print(f"DEBUG: Closing auction for land {land_id}")
        land = Land.objects.get(pk=land_id)
        if land.status != 'available':
            return Response({'message': 'Auction already closed'})
            
        leading_bid = land.bids.first()
        if leading_bid:
            print(f"DEBUG: Winner found: {leading_bid.bidder.email}")
            leading_bid.status = 'won'
            leading_bid.save()
            land.status = 'pending' # Waiting for payment
            land.save()
            
            # Send email
            print(f"DEBUG: Attempting to send email to {leading_bid.bidder.email}")
            try:
                send_winner_email(
                    leading_bid.bidder.email,
                    leading_bid.bidder.get_full_name() or leading_bid.bidder.username,
                    land.title,
                    leading_bid.amount_kes
                )
                email_status = "Winner notified"
            except Exception as mail_err:
                print(f"DEBUG: Email failed: {str(mail_err)}")
                email_status = "Database updated, but email failed to send"

            return Response({'message': f'{email_status} and auction closed'})
        
        return Response({'message': 'No bids found'})
    except Exception as e:
        print(f"DEBUG: Error in close_auction: {str(e)}")
        return Response({'error': str(e)}, status=500)