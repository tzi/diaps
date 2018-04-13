# Diaps

Like family's diaporama, but in JavaScript. [Slideshow example](https://tzi.github.io/diaps/example/)

## Quick Start

Add the diaps stylesheet in your HTML document head:

```html
<link rel="stylesheet" href="../dist/diaps.css">
```

Add 
 - a container for your slides
 - the diaps script at the end of your HTML document
 - open a script to use the main Diaps function
 
```html
<div class="slide"></div>
<script src="../dist/diaps.js"></script>
<script>
    Diaps('.slide', function (chain, controls) {
    });
</script>
```

Diaps take two parameters:

 - `selector`: a CSS selector to catch your container
 - `callback`: a callback to drive your slides

## Timing (chain)

The first parameter of your callback is a chain.

The three main methods of your timing chain is:

 - `chain.exec(callback)`: take a callback to execute when the time comes
 - `chan.wait(time)`: wait a time in second before executing the next link
 - `chain.delayed(callback, time)`: take a callback to execute when the time comes, but with a delay

Example:

```js
Diaps('.slide', function (chain) {
    
    // You always have to return the chain
    return chain
    
        // Wait 2 seconds
        .wait(2)
        
        // Display a user message
        .exec(function() {
            alert('Hello wolrd!');
        })
});
```

## Layers

You will finds the layers inside the controls, the second parameter of your callback.

There is 10 layers:

- `controls.layers.background`: fullscreen
- `controls.layers.center`: middle screen
- `controls.layers.top`: half screen top
- `controls.layers.left`: half screen left
- `controls.layers.right`: half screen right
- `controls.layers.bottom`: half screen bottom
- `controls.layers.nw`: North west corner
- `controls.layers.ne`: Noth east corner
- `controls.layers.se`: South east corner
- `controls.layers.sw`: South west corner
 

## Display Media (Image, Video and Text)

You will finds media objects inside the controls, the second parameter of your callback.

There is a `media.add()` method to create a new media with 2 parameters:
 - `content`: the source url or the content of the media
 - `class` (optional): to add an extra class on the HTML element  

```js
Diaps('.slide', function (chain, { Image, layers }) {
    
    return chain
        // Display a new image in the right layer
        .exec(Image.add('images/01.jpg').to(layers.right))
        
        // Wait 2s
        .wait(2)
        
        // Display a new image in the left layer, with fade in animation
        .exec(Image.add('images/01.jpg').fadeIn(layers.left))
        
        // Wait 2s
        .wait(2)
        
        // Remove the image from the right layer
        .exec(Image.from(layers.right).remove())
        
        // Wait 2s
        .wait(2)
        
        // Remove the image from the left layer, with fade out animation
        .exec(Image.from(layers.left).fadeOut())
        
});
```

There is 7 entering animation:

 - `slideInUp()`
 - `slideInRight()`
 - `slideInLeft()`
 - `slideInDown()`
 - `bounceIn()`
 - `fadeIn()`
 - `zoomIn()`
 
There is one static animation:

 - `bounce()`

There is 6 leaving animation:

 - `slideOutUp()`
 - `slideOutRight()`
 - `slideOutLeft()`
 - `slideOutDown()`
 - `bounceOut()`
 - `fadeOut()`

The animation are made with [Animate.css](https://daneden.github.io/animate.css/).

:warning: The animation duration is always 3s for now

:warning: You cannot remove a content with a transition, if the entering animation is not finished

## Querying Media (Image, Video and Text)

There is two methods to query a content from a layer:
 - `Image.from(layer)`: get **last** Image from a specific layer
 - `Image.first(layer)`: get **first** Image from a specific layer   

Example:

```js
Diaps('.slide', function (chain, { Image, layers }) {
    return chain
        .exec(Image.first(layers.left).fadeOut())
});
```

## Sound

You also can play a sound with diaps

Example:

```js
Diaps('.slide', function (chain, { Sound }) {
    return chain
        .exec(Sound.add('sound/intro.mp3'))
});
```

## Sequences

Sometimes, you want to iterate the same effect over and over on a list of media.

A sequence is function that take to parameters:
 - `chain`: a timing chain to return
 - `item`: the media item from the list
 - `index`: the media item index
 - `list`: the complete media list

```js
Diaps('.slide', function(chain, {Image, layers}) {
    

    // Create a new sequence to display images from the right to the left
    const alternateLeftRightSequence = function(chain, src, index) {
        var image = Image.add(src, 'polaroid');
        
        return chain.exec(index % 2 ? image.slideInRight(layers.right) : image.slideInLeft(layers.left))
            .wait(2);
    }
    
    // Use the sequence on a list of image
    return chain
        .sequence(alternateLeftRightSequence, [
            'images/1.jpg',
            'images/2.jpg',
            'images/3.jpg',
            'images/4.jpg'
        ]);
});
```
