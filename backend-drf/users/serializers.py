from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()



class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True) #password should not be sent back in response
    class Meta:
        model = User
        fields = ['id','email','username','password']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','email']
        read_only_fields = ["id",'email']