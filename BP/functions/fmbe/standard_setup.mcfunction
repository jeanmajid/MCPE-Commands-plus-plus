### Reposition and Define FMBE Scale
playanimation @s animation.player.sleeping none 0 "" controller.animation.fox.move
playanimation @s animation.creeper.swelling none 0 "v.xbasepos=v.xbasepos??0;v.ybasepos=v.ybasepos??0;v.zbasepos=v.zbasepos??0;v.xpos=v.xpos??0;v.ypos=v.ypos??0;v.zpos=v.zpos??0;v.xrot=v.xrot??0;v.yrot=v.yrot??0;v.zrot=v.zrot??0;v.scale=v.scale??1;v.xzscale=v.xzscale??1;v.yscale=v.yscale??1;v.swelling_scale1=2.1385*math.sqrt(v.xzscale*v.scale);v.swelling_scale2=2.1385*math.sqrt(v.yscale*v.scale);" wiki.scale
playanimation @s animation.ender_dragon.neck_head_movement none 0 "v.head_rotation_x=0;v.head_rotation_y=0;v.head_rotation_z=0;v.head_position_x=(v.xbasepos*0.433875)*math.sqrt(v.xzscale*v.scale);v.head_position_y=(10.05185375+v.ybasepos*0.467625)*math.sqrt(v.yscale*v.scale);v.head_position_z=(17.108-v.zbasepos*0.433875)*math.sqrt(v.xzscale*v.scale);" wiki.shift_pos

## Define FMBE Rotation
### X Axis
playanimation @s animation.warden.move none 0 "v.body_x_rot=90+v.xrot;v.body_z_rot=90+v.yrot;" wiki.xrot
### Z Axis
playanimation @s animation.player.attack.rotations none 0 "v.attack_body_rot_y=-v.zrot;" wiki.zrot

## Define FMBE Position
### X Axis
playanimation @s animation.parrot.moving none 0 "v.wing_flap=(16-v.xpos)*3.3333333;" wiki.xpos
### Y Axis
playanimation @s animation.minecart.move.v1.0 none 0 "v.rail_offset.x=0;v.rail_offset.y=1.6485+v.ypos/16;v.rail_offset.z=0;" wiki.ypos
### Z Axis
playanimation @s animation.parrot.dance none 0 "v.dance.x=-v.zpos;v.dance.y=0;" wiki.zpos