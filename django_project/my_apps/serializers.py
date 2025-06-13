from rest_framework import serializers
from .models import UserProfile, Product, CartItem, Order, OrderStatusHistory, Feedback, OrderItem
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = UserProfile
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'stock', 'description', 'species', 'food_type', 'tags', 'image', 'views']

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None


class CartItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(source='product.id')
    name = serializers.CharField(source='product.name')
    price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2)
    species = serializers.CharField(source='product.species', allow_null=True, required=False)
    food_type = serializers.CharField(source='product.food_type', allow_null=True, required=False)
    image = serializers.SerializerMethodField()
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            'id',
            'product_id',
            'name',
            'price',
            'quantity',
            'subtotal',
            'image',
            'species',
            'food_type'
        ]

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.product.image:
            image_url = obj.product.image.url
        else:
            image_url = '/media/images/placeholder.jpg'  # fallback image

        if request is not None:
            return request.build_absolute_uri(image_url)
        return image_url

    def get_subtotal(self, obj):
        return float(obj.quantity * obj.product.price)

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name')

    class Meta:
        model = OrderItem
        fields = ['product_name', 'quantity', 'price', 'subtotal']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(source='orderitem_set', many=True)

    class Meta:
        model = Order
        fields = ['id', 'date', 'status', 'total', 'note', 'full_name', 'phone', 'address', 'items']

class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'date', 'status', 'total', 'full_name', 'phone', 'address', 'note', 'items']

class OrderStatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderStatusHistory
        fields = '__all__'

class FeedbackSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Feedback
        fields = ['id', 'user', 'comment', 'sentiment', 'created_at']

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username

        # You can add more custom fields like:
        # token['email'] = user.email
        # token['is_staff'] = user.is_staff

        return token
    
