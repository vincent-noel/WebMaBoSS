# Generated by Django 2.1.2 on 2018-10-26 14:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_auto_20181026_1450'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mabosssimulation',
            name='fixpoints',
            field=models.TextField(null=True),
        ),
        migrations.AlterField(
            model_name='mabosssimulation',
            name='fptable',
            field=models.TextField(null=True),
        ),
        migrations.AlterField(
            model_name='mabosssimulation',
            name='nodes_probtraj',
            field=models.TextField(null=True),
        ),
        migrations.AlterField(
            model_name='mabosssimulation',
            name='states_probtraj',
            field=models.TextField(null=True),
        ),
    ]