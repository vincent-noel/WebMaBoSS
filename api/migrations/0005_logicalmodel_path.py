# Generated by Django 2.1.2 on 2018-10-03 13:39

import api.models.logical_model
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_taggedlogicalmodel'),
    ]

    operations = [
        migrations.AddField(
            model_name='logicalmodel',
            name='path',
            field=models.CharField(default=api.models.logical_model.new_model_path, max_length=12),
        ),
    ]