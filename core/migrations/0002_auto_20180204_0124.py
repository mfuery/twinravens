# Generated by Django 2.0.2 on 2018-02-04 01:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='location',
            name='icon',
            field=models.FileField(null=True, upload_to=''),
        ),
        migrations.AlterField(
            model_name='location',
            name='lat',
            field=models.FloatField(null=True),
        ),
        migrations.AlterField(
            model_name='location',
            name='lon',
            field=models.FloatField(null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='profile_picture',
            field=models.FileField(null=True, upload_to=''),
        ),
    ]