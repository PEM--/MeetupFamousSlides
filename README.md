Usage:

```bash
$ meteor add pierreeric:fview-slidedeck
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
