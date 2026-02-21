from rest_framework import serializers
from .models import Land, Bid, Payment


class LandImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Land
        fields = ['id', 'image']

class LandSerializer(serializers.ModelSerializer):
    tags        = serializers.SerializerMethodField()
    badge       = serializers.SerializerMethodField()
    owner_name  = serializers.SerializerMethodField()
    owner_phone = serializers.SerializerMethodField()
    owner_pic   = serializers.SerializerMethodField()
    images      = serializers.SerializerMethodField()

    class Meta:
        model  = Land
        fields = [
            'id', 'title', 'description', 'county', 'location',
            'latitude', 'longitude', 'auction_ends_at',
            'size_acres', 'price_kes', 'status', 'is_featured', 'is_new',
            'image_url', 'tags', 'badge', 'owner_name', 'owner_phone', 'owner_pic', 'images',
            'has_water', 'has_electricity', 'has_road_access',
            'has_fencing', 'has_irrigation', 'created_at',
        ]

    def get_tags(self, obj):
        return obj.get_tags()

    def get_badge(self, obj):
        if obj.is_featured: return 'featured'
        if obj.is_new:      return 'new'
        return None

    def get_owner_name(self, obj):
        return obj.owner.get_full_name() or obj.owner.username

    def get_owner_phone(self, obj):
        return obj.owner.phone or "Not Provided"

    def get_owner_pic(self, obj):
        if obj.owner.profile_pic:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.owner.profile_pic.url)
            return obj.owner.profile_pic.url
        return None

    def get_images(self, obj):
        request = self.context.get('request')
        return [request.build_absolute_uri(img.image.url) for img in obj.images.all()]


class LandCreateSerializer(serializers.ModelSerializer):
    # This field handles multiple image files in the request
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )

    class Meta:
        model  = Land
        fields = [
            'title', 'description', 'county', 'location',
            'latitude', 'longitude', 'auction_ends_at',
            'size_acres', 'price_kes',
            'has_water', 'has_electricity', 'has_road_access',
            'has_fencing', 'has_irrigation', 'uploaded_images'
        ]

    def create(self, validated_data):
        images_data = validated_data.pop('uploaded_images', [])
        validated_data['owner'] = self.context['request'].user
        land = Land.objects.create(**validated_data)
        
        from .models import LandImage
        for image_data in images_data:
            LandImage.objects.create(land=land, image=image_data)
            
        return land


class BidSerializer(serializers.ModelSerializer):
    land_title  = serializers.SerializerMethodField()
    bidder_name = serializers.SerializerMethodField()
    bidder_id   = serializers.ReadOnlyField(source='bidder.id')

    class Meta:
        model  = Bid
        fields = ['id', 'land', 'land_title', 'bidder_id', 'bidder_name',
                  'amount_kes', 'status', 'closes_at', 'created_at']

    def get_land_title(self, obj):  return obj.land.title
    def get_bidder_name(self, obj): return obj.bidder.get_full_name() or obj.bidder.username


class BidCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Bid
        fields = ['land', 'amount_kes']

    def create(self, validated_data):
        validated_data['bidder'] = self.context['request'].user
        bid = super().create(validated_data)

        # Mark all other bids on this land as outbid
        Bid.objects.filter(land=bid.land).exclude(id=bid.id).update(status='outbid')
        bid.status = 'leading'
        bid.save()
        return bid


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Payment
        fields = ['id', 'land', 'amount_kes', 'payment_type',
                  'status', 'mpesa_ref', 'description', 'created_at']