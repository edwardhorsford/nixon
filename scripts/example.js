
module.exports = {

    username: "",
    password: "",

    sizes: [
        {
            width: 320
        },
        {
            width: 1024,
        },
        {
            name: "iPad",
            width: 768,
            zoom: 2,
            suffix: '_x2'
        },
        {
            name: "page-heading",
            width: 1024,
            crop: 'h1'
        },
        {
            name: "square-crop",
            width: 1024,
            crop: {
                top : 100,
                left: 100,
                width: 100,
                height: 100
            }
        }
    ],

    steps: [
        {
            // Load the GOV.UK homepage and reload to get rid of 
            // cookie bar
            url: 'https://gov.uk',
            name: 'govuk-homepage',
            reloadPage: true,
        },{
            // Navigate to benefits browse page
            name: 'browse-benefits',
            // Click first anchor in browse list
            js : function(){
                $('.categories-list a')[0].click();
            },
            // Use expectedUrl to check that where we've browsed
            // to is where we expected to be.
            expectedUrl: 'https://gov.uk/browse/benefits'
        }
    ]
};
