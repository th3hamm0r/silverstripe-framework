title: WYSIWYG Styles
summary: Add custom CSS properties to the rich-text editor.

# WYSIWYG Styles

SilverStripe lets you customise the style of content in the CMS. This is done by setting up a CSS file called
`editor.css` in either your theme or in your `mysite` folder. This is set through


```php
use SilverStripe\Forms\HTMLEditor\HtmlEditorConfig;

HtmlEditorConfig::get('cms')->setOption('content_css', project() . '/css/editor.css');
```

Will load the `mysite/css/editor.css` file.

If using this config option in `mysite/_config.php`, you will have to instead call:


```php
HtmlEditorConfig::get('cms')->setOption('content_css', project() . '/css/editor.css');
```

Any CSS classes within this file will be automatically added to the `WYSIWYG` editors 'style' dropdown. For instance, to
add the color 'red' as an option within the `WYSIWYG` add the following to the `editor.css`


```css
.red {
    color: red;
}
```

<div class="notice" markdown="1">
After you have defined the `editor.css` make sure you clear your SilverStripe cache for it to take effect.
</div>

## API Documentation

* [HtmlEditorConfig](api:SilverStripe\Forms\HTMLEditor\HtmlEditorConfig)
