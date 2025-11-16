from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views import View
from django.utils import timezone
from django.core.mail import send_mail
from .models import *
import random
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import make_password,check_password
from rest_framework.views import APIView
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from django.contrib.auth import get_user_model
from django.contrib.auth import login
from rest_framework import viewsets
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import NotFound
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.http import JsonResponse
from .models import CustomUser, Shop
from .serializers import ShopSerializer


@api_view(['POST'])
def user_login(request):
    def generate_otp():
        return random.randint(100000, 999999)

    def send_otp(email, otp):
        subject = 'Your OTP for User Login'
        message = f'Your OTP for logging in is {otp}'
        from_email = 'bobbymanda056@gmail.com'
        try:
            send_mail(subject, message, from_email, [email])
            return True  # Indicate success
        except Exception as e:
            print(f"Email Sending Error: {str(e)}")
            return False  # Indicate failure

    email = request.data.get('email')
    password = request.data.get('password')

    # Debugging output
    print(f"Email: {email}")  # Check the values being passed

    # Authenticate the user
    user = CustomUser.objects.filter(email = email).first()  # Ensure your backend supports email authentication
    
    if user is None:
        print("Authentication failed.")  # Log the failure
        return JsonResponse({'error': 'Invalid credentials'}, status=400)

    # Only allow active users to login
    if user.is_active:
        login(request, user)
        OTP = generate_otp()
        
        if send_otp(email, OTP):
            Otp.objects.create(email=email, otp_code=OTP)
        else:
            return JsonResponse({'error': 'Failed to send OTP. Try again later.'}, status=500)
        
        refresh = RefreshToken.for_user(user)
        refresh['username'] = user.username
        return JsonResponse({
            'message': 'User login successful, OTP sent to your email.',
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        })
    else:
        return JsonResponse({'error': 'Your account is inactive. Please contact support.'}, status=403)


@api_view(['POST'])
def admin_login(request):
    def generate_otp():
        return random.randint(100000, 999999)
    def send_otp(email, otp):
        subject = 'Your OTP for Admin Login'
        message = f'Your OTP for logging in is {otp}'
        from_email = 'bobbymanda056@gmail.com'
        send_mail(subject, message, from_email, [email])
    email = request.data.get('email')
    password = request.data.get('password')
    try:
        user = CustomUser.objects.get(email=email)
    except user.DoesNotExist:
        return JsonResponse({'error': 'Invalid credentials'}, status=400)

    if user.check_password(password):
        if user.is_staff:
            login(request, user)
            OTP = generate_otp()
            send_otp(email, OTP)
            Otp.objects.create(email=email, otp_code=OTP)
            refresh = RefreshToken.for_user(user)
            refresh['email'] = user.email
            return JsonResponse({
                'message': 'Admin login successful, OTP sent to your email.',
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'name': user.username,
                'email': user.email
            })
        else:
            return JsonResponse({'error': 'Access denied. Admin only.'}, status=403)

    return JsonResponse({'error': 'Invalid credentials'}, status=400)


@api_view(['POST'])
def verify_otp(request):
    otp_code = request.data.get('otp_code')
    getOtp = Otp.objects.filter(otp_code=otp_code).first()  # Retrieve OTP

    if getOtp:
        getOtp.delete()  
        return JsonResponse({'message': 'OTP verified successfully.'}, status=200)  
    else:
        return JsonResponse({'error': 'Invalid OTP.'}, status=404)  

    
@api_view(['POST'])
def send_otp(request):
    email = request.data.get('email')

    if not email:
        return Response({'message': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

    otp_code = str(random.randint(100000, 999999))

    try:
        otp_instance, created = Otp.objects.update_or_create(
            email=email,
            defaults={'otp_code': otp_code}
        )
        print(f"OTP stored for {email}: {otp_code}") 
    except Exception as e:
        print(f"Error storing OTP: {str(e)}") 
        return Response({'message': 'Error storing OTP', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    try:
        send_mail(
            subject='Your OTP Code',
            message=f'Your OTP code is: {otp_code}',
            from_email='manjushaakasapu0@gmail.com',
            recipient_list=[email],
        )
    except Exception as e:
        return Response({'message': 'Failed to send email', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({'message': 'OTP sent successfully'}, status=status.HTTP_200_OK)


@api_view(['POST'])
def reset_password(request):
    Email = request.data.get('email')
    Password = request.data.get('password')
    user = CustomUser.objects.filter(email=Email).first()
    if user.is_active :
        user.password = make_password(Password)
        user.save()

    return Response({'message': 'password reset is successfull'},status=status.HTTP_200_OK)
    

class ShopManagementView(generics.CreateAPIView):
    serializer_class = ShopSerializer

    def create(self, request, *args, **kwargs):
        # Extract data from the request
        shop_name = request.data.get('shopName')
        address = request.data.get('address')
        email = request.data.get('email')
        password = request.data.get('password')
        profileimage = request.FILES.get('profileImage')

        # Check if the email already exists
        if CustomUser.objects.filter(email=email).exists():
            return Response({'error': 'User with this email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if profile image is uploaded
        if not profileimage:
            return Response({'error': 'Profile image is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Create user
        try:
            user_serializer = UserSerializer(data={'username': shop_name, 'email': email, 'password': password})
            if user_serializer.is_valid(raise_exception=True):
                user = user_serializer.save()

            # Create the shop entry with the user object (not just the user id)
            shop_serializer = ShopSerializer(data={
                'user': user,  # Pass the actual user object
                'shop_name': shop_name,
                'address': address,
                'email': email,
                'password': password,  # Store plain text password (not recommended)
                'profileimage': profileimage
            })
            if shop_serializer.is_valid(raise_exception=True):
                shop = shop_serializer.save()

            # Send welcome email
            subject = "Welcome to Pharmacy Management"
            message = f"Dear {shop_name},\n\nYou have been added to the Pharmacy Management system. Welcome to our Pharmacy Management {user}!"
            from_email = 'manjushaakasapu0@gmail.com'
            recipient_list = [email]

            send_mail(subject, message, from_email, recipient_list)

            # Prepare shop data for response
            shop_data = {
                "id": shop.id,
                "shop_name": shop.shop_name,
                "address": shop.address,
                "profileimage": shop.profileimage.url if shop.profileimage else None
            }

            return Response({
                'message': 'Shop added successfully, user created, and email sent',
                'shop': shop_data
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': f"Shop added but email could not be sent. Error: {str(e)}"}, status=status.HTTP_201_CREATED)
        

class ShopUpdateView(generics.UpdateAPIView):
    serializer_class = ShopSerializer
    queryset = Shop.objects.all()

    def update(self, request, *args, **kwargs):
        # Get the shop instance by ID or other unique identifier
        shop_instance = self.get_object()

        # Extract updated data from the request
        shop_name = request.data.get('shop_name', shop_instance.shop_name)
        address = request.data.get('address', shop_instance.address)
        email = request.data.get('email', shop_instance.email)
        password = request.data.get('password', shop_instance.password)
        profileimage = request.FILES.get('profileImage', shop_instance.profileimage)

        print(shop_name,"shop_name")
        print(address,"address")
        print(email,"email")
        print(password,"password")
        print(profileimage,"profile")

        # Update the related CustomUser instance
        try:
            # Fetch the associated user instance
            user_instance = shop_instance.user
            user_serializer = UserSerializer(user_instance, data={
                'username': shop_name,  # Update username with the shop name
                'email': email,
                'password': password
            }, partial=True)  # Allow partial updates (only update the provided fields)

            if user_serializer.is_valid(raise_exception=True):
                user = user_serializer.save()

            # Update the shop entry with the updated data
            shop_serializer = ShopSerializer(shop_instance, data={
                'user': user,  # Pass the updated user object
                'shop_name': shop_name,
                'address': address,
                'email': email,
                'password': password,
                'profileimage': profileimage
            }, partial=True)  # Allow partial updates for shop fields

            if shop_serializer.is_valid(raise_exception=True):
                shop = shop_serializer.save()

            # Prepare the response data
            shop_data = {
                "id": shop.id,
                "shop_name": shop.shop_name,
                "email":shop.email,
                "address": shop.address,
                "profileimage": shop.profileimage.url if shop.profileimage else None
            }

            return Response({
                'message': 'Shop updated successfully',
                'shop': shop_data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': f"Shop updated but error occurred: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


class ShopDeleteView(generics.DestroyAPIView):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer

    def delete(self, request, *args, **kwargs):
        try:
            # Get the shop instance based on the provided ID
            shop_instance = self.get_object()

            # Get the associated user
            user_instance = shop_instance.user

            # Delete the shop
            shop_instance.delete()

            # Optionally, delete the associated user
            user_instance.delete()

            return Response({'message': 'Shop and associated user deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

        except Exception as e:
            return Response({'error': f"Failed to delete shop. Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_shops(request):
    try:
        shops = Shop.objects.all()
        serializer = ShopSerializer(shops, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)



















@api_view(['GET', 'POST'])
def medicine_list(request):
    if request.method == 'GET':
        medicines = Medicine.objects.all()
        serializer = MedicineSerializer(medicines, many=True)
        return Response(serializer.data)
    
    if request.method == 'POST':
        serializer = MedicineSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data)

@api_view(['PUT', 'DELETE'])
def medicine_detail(request, pk):
    try:
        medicine = Medicine.objects.get(pk=pk)
    except Medicine.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # Handle the PUT (update) request
    if request.method == 'PUT':
        serializer = MedicineSerializer(medicine, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Handle the DELETE request
    elif request.method == 'DELETE':
        medicine.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def get_medicines(request):
    medicines = Medicine.objects.all()
    serializer = MedicineSerializer(medicines, many=True)
    return Response(serializer.data)






class add_order(APIView):
    permission_classes = [IsAuthenticated]  # Ensures that only authenticated users can access this view

    def post(self, request):
        # Get the authenticated user (shop owner)
        user = request.user
        
        if user.is_authenticated:
            # Extract data from the request
            data = request.data
            drug_name = data.get('drug_name')
            medicine_name = data.get('medicine_name')
            count = data.get('count')

            # Fetch the Shop instance related to the authenticated user
            shop = Shop.objects.filter(user=user).first()  # Assuming each user has a Shop

            if not shop:
                return Response({"error": "Shop not found for the authenticated user"}, status=status.HTTP_404_NOT_FOUND)

            # Ensure either drug_name or medicine_name is provided
            if not drug_name and not medicine_name:
                return Response({"error": "Please provide either a drug or medicine name"}, status=status.HTTP_400_BAD_REQUEST)

            # Fetch the medicine/drug from the database
            medicine = Medicine.objects.filter(name=medicine_name or drug_name).first()
            if not medicine:
                return Response({"error": "Selected medicine/drug not found"}, status=status.HTTP_404_NOT_FOUND)

            # Check if the requested count exceeds available quantity
            if int(count) > medicine.count:
                return Response({"error": "Count exceeds available quantity"}, status=status.HTTP_400_BAD_REQUEST)

            # Decrease the stock count of the medicine/drug
            medicine.count -= int(count)
            medicine.save()

            # Create a new UserOrder for the shop
            UserOrder.objects.create(
                user=user,  # Associate the order with the authenticated user
                shop=shop,  # Associate the order with the authenticated user's shop
                drug_name=drug_name,
                medicine_name=medicine_name,
                count=count,
                address=shop.address  # Use the shop's address
            )

            return Response({"message": "Order added successfully"}, status=status.HTTP_201_CREATED)
        
        return Response(status=status.HTTP_401_UNAUTHORIZED)






        
class get_orders(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user  # Get the authenticated user object
        try:
            if user.is_authenticated:
                # Fetch the shop related to the authenticated user
                shop = Shop.objects.filter(user=user).first()

                if not shop:
                    return Response({"detail": "Shop not found for the authenticated user."}, status=status.HTTP_404_NOT_FOUND)

                # Use the foreign key (shop object) to filter orders
                orders = UserOrder.objects.filter(shop=shop)

                if orders.exists():
                    print(f"Orders retrieved for {shop.shop_name}: {orders}")
                    serializer = OrderSerializer(orders, many=True)
                    return Response(serializer.data)
                else:
                    return Response({"detail": "No orders found for this shop."}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({"detail": "User not authenticated."}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            # Log any error that occurs
            print(f"Error: {str(e)}")
            return Response({"detail": "Error retrieving orders", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)






@api_view(['GET', 'DELETE'])
def manage_order(request, pk):
    try:
        order = UserOrder.objects.get(pk=pk)
    except UserOrder.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = OrderSerializer(order)
        return Response(serializer.data)

    elif request.method == 'DELETE':
        order.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    









@api_view(['POST'])
def AdminProfile_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    image = request.FILES.get('image')  # Get the uploaded image file

    # Check if user is a superuser
    user = CustomUser.objects.filter(email=email).first()
    if user:
        if user.is_superuser:
            user.password = make_password(password)  # Hash the password
            user.save()

            # Handle the AdminProfile image upload
            admin_profile, created = AdminProfile.objects.get_or_create(user=user)
            if image:
                admin_profile.image = image  # Assign the uploaded image
            admin_profile.save()  # Save the AdminProfile
            return Response({'detail': 'Password and profile updated successfully', 'image': admin_profile.image.url}, status=status.HTTP_200_OK)
            
    return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)



class getuser(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.is_authenticated:
            admin = CustomUser.objects.filter(username=user.username).first()
            if admin.is_superuser:
                return Response({'Admin': admin})
            else:
                student = Shop.objects.get(shop_name=user.username)
                serializer = ShopSerializer(student,context={'request': request})
                return Response({'user': serializer.data})
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        







class UserOrderListView(generics.ListCreateAPIView):
    queryset = UserOrder.objects.all()
    serializer_class = OrderSerializer

    def get_queryset(self):
        search = self.request.query_params.get('search', None)
        queryset = super().get_queryset()
        if search:
            queryset = queryset.filter(shop__shop_name__icontains=search)
        return queryset


@api_view(['POST'])
def DeliveredView(request, id):
    order = UserOrder.objects.filter(id=id).first()
    if order:
        order.delivery_status = 'Delivered'
        order.delivery_date = timezone.now()
        order.save()

        # Send email notification for delivery
        send_mail(
            'Order Delivered',
            f'Your order with ID {id} has been delivered.',
            settings.DEFAULT_FROM_EMAIL,
            [order.user.email],  # Assuming you have a user field in UserOrder with an email attribute
            fail_silently=False,
        )
        return Response(status=status.HTTP_200_OK)
    return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)


class PendingOrdersView(APIView):
    def get(self, request):
        pending_orders = UserOrder.objects.filter(delivery_status='Pending')
        serializer = OrderSerializer(pending_orders, many=True)
        return Response(serializer.data)


@api_view(['PATCH'])
def update_payment_status(request, pk):
    try:
        order = UserOrder.objects.get(pk=pk)
    except UserOrder.DoesNotExist:
        return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

    if 'payment_status' in request.data:
        order.payment_status = request.data['payment_status']
        order.save()
        
        # Send email notification for payment status update
        if order.payment_status == 'Paid':
            send_mail(
                'Payment Received',
                f'Your payment for order ID {pk} has been successfully processed.',
                settings.DEFAULT_FROM_EMAIL,
                [order.user.email],  # Assuming the user has an email field
                fail_silently=False,
            )

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)








class DeliveredOrdersView(APIView):
    # authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            # Fetch all orders with "Delivered" status
            orders = UserOrder.objects.filter(delivery_status="Delivered", shop__user=request.user)
        except UserOrder.DoesNotExist:
            return Response({'error': 'No delivered orders found'}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the delivered orders
        serializer = OrderSerializer(orders, many=True)

        return Response({
            'orders': serializer.data
        }, status=status.HTTP_200_OK)



class UserPendingOrdersView(APIView):
    # authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Fetch the user orders that are pending
        user_orders = UserOrder.objects.filter(delivery_status="Pending", shop__user=request.user)  # Assuming shop has a FK to user

        # Serialize the pending orders
        serializer = OrderSerializer(user_orders, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class UnpaidOrdersView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Filter orders with payment status 'Unpaid' for the authenticated user
        unpaid_orders = UserOrder.objects.filter(payment_status='Unpaid', shop__user=request.user)

        # Serialize the data
        serializer = OrderSerializer(unpaid_orders, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)





@api_view(['GET'])
def pending_orders_count(request):
    pending_count = UserOrder.objects.filter(delivery_status="Pending").count()
    return Response({"count": pending_count})