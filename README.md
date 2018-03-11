Tabble
======

Tabble automatically creates tables and columns with colspan, rowspan, custom styling wtihout breaking the HTML markup or having you to deal with appending HTML manually.

Around 2011/2012 I needed a quick (and therefore dirty) way of creating and mostly changing big tables rather fast (tbody content). Including custom styling for specific columns, or rowspan and colspan.

Handling this manually was too much of a pain and led to broken HTML markup, broken tables and a lot of messy HTML-string handling in JavaScript. Born was Tabble, taking my mind off of these time-consuming tasks.

Recently I was looking through my old stuff and found this little tool again. 

Hence I thought I put this for archiving reasons up. Still works great with jQuery 3.x to my surprise, even if it seems overly complicated in what it does to achieve the desired outcome.

# How to use Tabble

Container for Tabble:

`<div class="my-tabble-container"></div>`

Initialize it:

```javascript
$('.my-tabble-container').tabble(
    [{
        id: 'id1',         // Some custom id to use for this column
        text: 'col1',      // The text displayed
        _class: 'class1',  // Some custom class
        colspan: 2,        // How many cols will this one hold
        width: '100px'     // Inline width, bad practice, but I mentioned dirty ;)
    }],
    {
        // Custom, inline css for the created table
        // will be used for $.css() as is
    }
)
```

Instead of using clunky JSON Objects you could also simply use an array of strings.
```javascript
$('.my-tabble-container').tabble([ 'column1', 'column2', ..., 'columnN' ]);
```
For the second parameter you can also just use a simple string, this will be added as a class to the table.

Put as many columns in the first array as you like. If you use the JSON variant, all properties are optional except for `text`.

# Adding content

The above will create the `thead` only. To put in content into `tbody`, you use `addCell`. Used similar to the constructor `tabble()`:

```javascript
$('.my-tabble-container').addCell([
    {
        id: 'id1',         // Some custom id to use for this column
        text: 'col1',      // The text displayed
        _class: 'class1',  // Some custom class
        colspan: 2,        // How many cols will this one hold
        rowspan: 1,        // How many rows for this column?
        width: '100px'     // Inline width, bad practice, but I mentioned dirty ;)
    }
]);
```

Tabble will try to make sure columns with col-/rowspan aren't interfering with each other. This might lead to shifted columns but no broken HTML markup.

Again, you can use an array of strings instead of JSON objects here as well. If you want to add only a specific column with text, you can just say so:

`$('.my-tabble-container').addCell('my one cell content');`

# Removing content

Since Tabble is supposed to update big tables that have colspan, rowspan and potentially a custom class for custom styling, you can remove the content of the tbody entirely with this:

`$('.my-tabble-container').removeBody();`
