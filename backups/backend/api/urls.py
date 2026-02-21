from django.urls import path
from . import views

urlpatterns = [
    path('',                         views.api_overview,   name='api-overview'),
    path('listings/',                views.listing_list,   name='listing-list'),
    path('listings/create/',         views.listing_create, name='listing-create'),
    path('listings/mine/',           views.my_listings,    name='my-listings'),
    path('listings/<int:pk>/',       views.listing_detail, name='listing-detail'),
    path('bids/',                    views.place_bid,      name='place-bid'),
    path('bids/mine/',               views.my_bids,        name='my-bids'),
    path('bids/land/<int:land_id>/', views.land_bids,      name='land-bids'),
    path('payments/mine/',           views.my_payments,    name='my-payments'),
    path('payments/initiate/<int:land_id>/', views.initiate_payment, name='initiate-payment'),
    path('listings/close/<int:land_id>/',    views.close_auction,    name='close-auction'),
    path('summary/',                 views.my_summary,     name='my-summary'),
]
