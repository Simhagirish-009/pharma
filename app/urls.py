from django.urls import path
from .views import *

urlpatterns = [
    path('admin-login/', admin_login, name='admin-login'),
    path('user-login/', user_login, name='user-login'),
    path('send_otp/', send_otp, name='send_otp'),
    path('verify/', verify_otp, name='verify_otp'), 
    path('medicines/', medicine_list, name='medicine_list'),
    path('medicines/<int:pk>/', medicine_detail, name='medicine_detail'),
    path('medicines/', get_medicines, name='get_medicines'),
    path('addorders/', add_order.as_view(), name='add_order'),
    path('orders/list/', get_orders.as_view(), name='get_orders'),
    path('manage_order/<int:pk>/', manage_order, name='manage_order'),
    path('orders/', get_orders.as_view(), name='get_orders'),



    path('shop/', ShopManagementView.as_view(), name='shop_management'),
    path('get-shop/', get_shops, name='get-shop'),
    path('shop/update/<int:pk>/', ShopUpdateView.as_view(), name='shop-update'),
    path('shop/delete/<int:pk>/', ShopDeleteView.as_view(), name='shop-delete'),

    
     
    path('AdminProfile/', AdminProfile_view, name='admin-list-create'),  
    path('restpassword/',reset_password,name='reset_password'),

    path('getuser/',getuser.as_view()),


    path('user-order-details/', UserOrderListView.as_view(), name='user-order-list'),
    path('order-details/<int:id>/', DeliveredView, name='user-order-detail'),
    path('pending-orders/',PendingOrdersView.as_view(), name='pending-orders'),
    path('order-paid/<int:pk>/', update_payment_status, name='update_payment_status'),
    path('delivered-orders/',DeliveredOrdersView.as_view(),name='DeliveredOrdersView'),
    path('pending/', UserPendingOrdersView.as_view(), name='pending-orders'),
    path('unpaid/', UnpaidOrdersView.as_view(), name='unpaid-orders'),
    
    path('pending-orders-count/', pending_orders_count, name='pending_orders_count'), 
]
