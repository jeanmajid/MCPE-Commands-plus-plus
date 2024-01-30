if @itemStack.typeId minecraft:feather;
@source.applyKnockback @source.getViewDirection().x @source.getViewDirection().z 5 @source.getViewDirection().y*2;
clear @s feather 0 1;
endif