# SlideDeck - A slide deck engine
A plugin for [famous-views](http://famous-views.meteor.com/).

Create your fluid and beautiful collaborative slides with
[Famo.us](http://famo.us/) & [Meteor.js](https://www.meteor.com/) within seconds.

![Example of slides](https://raw.githubusercontent.com/PEM--/MeetupFamousSlides/master/private/doc/slides.jpg)

## Usage
Starts with the usual and add some packages:
```bash
meteor create myslides
cd myslides
mkdir client
meteor add gadicohen:famous-views pierreeric:fview-slidedeck
# From here you can choose your favorite Famo.us provider, mine is Raix's one.
meteor add raix:famono
```

You can choose to write your slides with Blaze or
with [Maxime Quandalle's Jade](https://github.com/mquandalle/meteor-jade).
```bash
meteor add mquandalle:jade
```

And then in `client` directory, create as many Blaze or Jade file as you
want which will contain your `template` named with `slideXX`, where `XX`
is an `Number` and act as your route to your slide content:
```jade
template(name='slide1')
  +Surface size='[900, undefined]' align='[.5, .5]' origin='[.5, .5]'
    h2 Meetup Famous
    h1 Physic engine
    img.gravatar(src='/gravatar.png')
    .footer PEM : Pierre-Eric Marchandet

template(name='slide2')
  +Surface size='[900, undefined]' align='[.5, .5]' origin='[.5, .5]'
    h2 Meetup Famous - Chapter 1
    p Let us start with the basic...
    .footer PEM : Pierre-Eric Marchandet

...
```
That's it! Additional layouts, themes and transitions coming soon.

## Examples
3 examples are provided in the [Github repository](https://github.com/PEM--/MeetupFamousSlides):
* Example 01: Used for a Famo.us meetup in Paris, each slide is a jade file.
* Example 02: A reproduction of the former example, this time, all slides are in a single jade file.
* Example 03: The slides are now using a different layout which looks like Impress.js.

## Customization
### Layout
Take a look at [lib/layout.jade](lib/layout.jade).  You can copy and paste this
and make your own custom layout Template called `layout`.  If we detect that on
load, we'll automatically use it instead of `defaultLayout`, and still add our
same helpers onto it for your use.

### Themes
A basic theme is provided for a nice display out of the box. You can easily
customize it with CSS, LESS, Stylus or in CoffeeScript using [CSSC](https://github.com/PEM--/cssc/).
