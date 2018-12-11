# You need to use these functions to display the images
!!! when the spritesheet is run all _ are converted to - so logo_image.png is logo-image

## sprite ($collapsed-background-map, 'keep');
This does a 1X sprite. 100% size of image in spritesheet. Provide the map and the image name

## sprite-retina ($collapsed-background-map, 'keep')
This does a 2X sprite. 50% of image in spritesheet. 2:1 Provide the map and the image name

## SpriteSheet Variables
Replace the variable with any of these names. Use the "standard" set for standards. The rest for RMs. 

$standard-background-map
$standard-foreground-map
$collapsed-background-map
$collapsed-foreground-map
$auto-expanded-foreground-map
$auto-expanded-background-map
$expanded-foreground-map
$expanded-background-map


## You can also use regular images like this in sass. 

background-image: url('../images/logo.jpg');
