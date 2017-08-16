/**
 * All functions side-effect only
 */
$(document).ready(function (e) {

    initialize();

    function initialize() {
        nav_link_init();
        nav_user_init();

    }

    function nav_link_init() {

        set_nav_click_function($('#brand_link'));
        set_nav_click_function($('#navigation_links').find('a'));


        $('#navigation_links').show();
        $('#user_panel').show();
    }

    /**
     *
     * @param $anchor_ele
     */
    function set_nav_click_function($anchor_ele) {
        $anchor_ele.click(function (e) {
            e.preventDefault();

            var category_param = $(this).attr("href").replace("#", "");
            if (category_param != $('#category').val()) {
                $('#content-title').text('');
                $('#category').val(category_param);

                load_category();
                if ($('#RDCO-navbar-collapse').hasClass('in')) {
                    $('.navbar-toggle').click();
                }

            }
        });
    }

    function nav_user_init() {
        $('#nav_sign_out').click(function (e) {
            e.preventDefault();
            $.get('ajax/index/sign_out.php', function () {
                window.location.reload();
            });
        });

        set_nav_click_function($('#nav_config'));

        set_user_welcome();
        $('#user_panel').show();
    }


    function load_category() {
        var $category = $('#category').val();
        update_selected_nav($category);
        $('#content-title').append($category);
        $.get('ajax/index/category_handler.php', {category: $category}, function (response) {
            $('#content_frame').html($(response));
        });
    }

    function update_selected_nav(category) {
        var $clicked_nav = $('#nav_' + category);

        $('#navigation_links').find('li').removeClass('active');
        $clicked_nav.addClass('active');
        $('#navigation_links').find('.dropdown').has($clicked_nav).addClass('active');
    }

    function set_user_welcome() {
        var curr_time = new Date().getHours();
        var welcome_msg = "Good ";
        if (curr_time < 12) {
            welcome_msg += "morning";
        } else if (curr_time < 15) {
            welcome_msg += "afternoon";
        } else {
            welcome_msg += "evening";
        }

        $('#user_welcome').html(welcome_msg);
    }

});

