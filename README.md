# SlideDeck - A slide deck engine
A plugin for [famous-views](http://famous-views.meteor.com/).

Create your fluid and beautiful collaborative slides with
[Famo.us](http://famo.us/) & [Meteor.js](https://www.meteor.com/) within seconds.


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

You can choose to write your slides with Blaze or with Maxime Quandalle's Jade.
```bash
meteor add mquandalle:jade
```

And then create in `client` directory:

```jade
template(name='slide1')
  +HeaderFooterLayout headerSize=100 footerSize=70
    +Surface target='header'
      h2 Meetup Famous
    +Surface target='content'
      h1 Physic engine
      img.gravatar(src='/gravatar.png')
    +Surface target='footer'
      p PEM : Pierre-Eric Marchandet
```

```jade
template(name='slide2')
  etc
```

That's it!

Slide templates/themes/transitions coming soon.

## Customization

Take a look at [lib/layout.jade](lib/layout.jade).  You can copy and paste this
and make your own custom layout Template called `layout`.  If we detect that on
load, we'll automatically use it instead of `defaultLayout`, and still add our
same helpers onto it for your use.
