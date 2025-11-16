from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import *

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        user = authenticate(username=email, password=password)
        if user and user.is_active:
            if user.is_staff:
                return {'user': user, 'message': 'Admin login successful'}
            return {'user': user, 'message': 'User login successful'}
        raise serializers.ValidationError("Invalid email or password")



class MedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicine
        fields = '__all__'

    def validate(self, data):
        if not data.get('expiry_date'):
            raise serializers.ValidationError("Expiry date is required")
        if not data.get('manufacturing_date'):
            raise serializers.ValidationError("Manufacturing date is required")
        return data







class ShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shop
        fields = ['id','user', 'shop_name', 'address', 'email', 'password', 'profileimage']

    def create(self, validated_data):
        # Extract the user field and create the shop entry with remaining validated data
        user = validated_data.pop('user')
        shop = Shop.objects.create(user=user, **validated_data)
        return shop

    def update(self, instance, validated_data):
        # Handle user separately to update if needed
        user_data = validated_data.pop('user', None)
        print(user_data,"user data")
        

        # Update the shop instance with the remaining validated data
        instance.shop_name = validated_data.get('shop_name', instance.shop_name)
        instance.address = validated_data.get('address', instance.address)
        instance.email = validated_data.get('email', instance.email)
        instance.password = validated_data.get('password', instance.password)
        instance.profileimage = validated_data.get('profileimage', instance.profileimage)
        instance.save()

        return instance

    def to_internal_value(self, data):
        # Convert user instance to its primary key if needed
        if 'user' in data:
            user = data['user']
            if isinstance(user, CustomUser):
                data['user'] = user.pk  # Convert user instance to primary key
        return super().to_internal_value(data)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
    


class OrderSerializer(serializers.ModelSerializer):
    shop_name = serializers.SerializerMethodField()

    class Meta:
        model = UserOrder
        fields = '__all__'  # Or specify fields explicitly if preferred

    def get_shop_name(self, obj):
        return obj.shop.shop_name if obj.shop else None