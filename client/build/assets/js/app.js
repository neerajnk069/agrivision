(function ($) {

    'use strict';

    function initMetisMenu() {
        //metis menu
        $("#side-menu").metisMenu();
    }

    function initLeftMenuCollapse() {
        if ($(window).width() <= 1199.98) {
            $('body').removeClass('sidebar-enable');
        }

        $('.vertical-menu-btn').on('click', function (event) {
            event.preventDefault();
            $('body').toggleClass('sidebar-enable');
            if ($(window).width() >= 1200) {
                $('body').toggleClass('vertical-collpsed');
            } else {
                $('body').removeClass('vertical-collpsed');
            }
        });
        $('.hide-menu-btn, .sidebar-overlay').click (function () {
            $('body').removeClass('sidebar-enable');
        });
        if ($(window).width() >= 1200) {
            $(".vertical-menu").hover(function () {
                $("body").addClass("hovered");
            }, function () {
                $("body").removeClass("hovered");
            })
        } else {
            $("body").removeClass("hovered");
        }
    }

    function initActiveMenu() {
        // === following js will activate the menu in left side bar based on url ====
        $("#sidebar-menu a").each(function () {
            var pageUrl = window.location.href.split(/[?#]/)[0];
            if (this.href == pageUrl) {
                $(this).addClass("active");
                $(this).parent().addClass("mm-active"); // add active to li of the current link
                $(this).parent().parent().addClass("mm-show");
                $(this).parent().parent().prev().addClass("mm-active"); // add active class to an anchor
                $(this).parent().parent().parent().addClass("mm-active");
                $(this).parent().parent().parent().parent().addClass("mm-show"); // add active to li of the current link
                $(this).parent().parent().parent().parent().parent().addClass("mm-active");
            }
        });
    }

    function initMenuItemScroll() {
        // focus active menu in left sidebar
        $(document).ready(function(){
            if($("#sidebar-menu").length > 0 ){
                var activeMenu = $("#sidebar-menu .mm-active .active").offset().top;
                if( activeMenu > 300) {
                    activeMenu = activeMenu - 300;
                    $(".simplebar-content-wrapper").animate({ scrollTop: activeMenu }, "slow");
                }
            }
        });
    }

    function initDropdownMenu() {
        $('.dropdown-menu a.dropdown-toggle').on('click', function(e) {
            if (!$(this).next().hasClass('show')) {
              $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
            }
            var $subMenu = $(this).next(".dropdown-menu");
            $subMenu.toggleClass('show');
    
            return false;
        });   
    }
    
    function initComponents() {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    }

    function initAdditional() {
        $(document).ready(function() {
            $('.basic-select').select2({
                minimumResultsForSearch: Infinity
            });
        });
        $('td').click(function () {
            $('tr').removeClass('tractive');
            $(this).parent('tr').addClass('tractive');
        });
        $('.view-right').click(function () {
            $('tr').removeClass('tractive2');
        });
        $('.view-right').click(function () {
            $('#man-toggle').addClass('rt-active');
        });
        $('.close-rt-card').click(function () {
            $('#man-toggle').removeClass('rt-active');
            $('tr').removeClass('tractive2');
        });
        $(document).ready(function(){
            if ($(window).width() <= 767.98) {
                $('tr').removeClass('tractive2');
                $("#man-toggle").removeClass("rt-active");

                $('.view-right').click(function () {
                    $('body').addClass('over-active');
                });
                $('.close-rt-card').click(function () {
                    $('body').removeClass('over-active');
                });
                $('.scmob').removeAttr('style');
            }
        });
        $(window).on('load', function () {
            setTimeout(function () {
                $('.preload').addClass('hide');
            }, 700);
        });
        $(window).on('load', function () {
            setTimeout(function () {
                $('.simplebar-content-wrapper').scrollTop(0);
            }, 1000);
        });

        $(document).ready(function () {
            $('.mexpand').on('click', function (e) {
                e.stopPropagation();
                $('body').addClass('notiexpand');
            });
        });

        $(document).ready(function () {
            $('.btn.rtmntrash').on('click', function (e) {
                e.stopPropagation();
            });
        });

        $(document).ready(function () {
            $('.modal-backdrop').first().addClass('first-backdrop');
            $('.modal-backdrop').last().addClass('last-backdrop');
        });

        $(document).ready(function () {
            $('.msdelt.close-addsms.for-small').on('click', function (e) {
                e.stopPropagation();
                $('body').addClass('rdcustom');
            });
        });

        $(document).ready(function () {
            $('[data-bs-dismiss=modal]').on('click', function (e) {
                e.stopPropagation();
            });
        });

        $(document).ready(function () {
            $('.noti-icon').on('click', function (e) {
                $('body').removeClass('notiexpand');
            });
        });
        
        $(document).ready(function () {
            $(".moredrop").on("click", function (e) {
                e.stopPropagation();
            });

            $(".moredrop .dropdown-menu").on("click", function (e) {
                e.stopPropagation();
            });
        });

        $(document).on('click', '.rtmntrash', function () {
            $('.offcanvas-end').removeClass('show');
            var $backdrops = $('.modal-backdrop.fade.show');
            if ($backdrops.length === 2) {
                $backdrops.last().removeClass('show');
            }
        });


        $(document).ready(function(){
            if ($(window).width() <= 575.98) {
                $('.add-ms').on('click', function (e) {
                    $('body').addClass('mobsms');
                });
                $('.add-sms').on('click', function (e) {
                    $('body').addClass('mobsms');
                });
                $('.close-addsms').on('click', function (e) {
                    $('body').removeClass('mobsms');
                    $('#repnow').removeClass('active');
                });
                $('.mobsms .modal-backdrop').on('click', function (e) {
                    $('body').removeClass('mobsms');
                    $('#repnow').removeClass('active');
                });
            }
        });

        $(document).ready(function () {
            $('.opencls').hide();
            $('.src-empty').hide();
            $('.serach-result').show();

            // Prevent dropdown from closing when clicking or typing inside
            $('#infoeu').on('input click', function (e) {
                e.stopPropagation(); // <== Prevent dropdown from closing
                let value = $(this).val().trim();

                if (value !== '') {
                    $('.opencls').show();
                    $('.serach-result').hide();
                    $('.src-empty').css("display", "flex");
                } else {
                    $('.opencls').hide();
                    $('.serach-result').show();
                    $('.src-empty').hide();
                }
            });

            // Also prevent closing when clicking the clear icon
            $('.opencls').on('click', function (e) {
                e.stopPropagation(); // <== Prevent dropdown from closing
                $('#infoeu').val('');
                $(this).hide();
                $('.serach-result').show();
                $('.src-empty').hide();
            });
        });

        // Haptic feedback function
        function hapticFeedback() {
            if ("vibrate" in navigator) {
                navigator.vibrate(30); // Vibrate for 30 milliseconds
            }
        }

        $(document).ready(function () {
            var touchStartX = 0;
            var touchEndX = 0;
            var touchStartY = 0;
            var isSwipe = false;

            $(".wepad").on("touchstart", function (e) {
                touchStartX = e.originalEvent.touches[0].clientX;
                touchStartY = e.originalEvent.touches[0].clientY;
                isSwipe = false;
            });

            $(".wepad").on("touchmove", function (e) {
                var currentX = e.originalEvent.touches[0].clientX;
                var currentY = e.originalEvent.touches[0].clientY;

                // Detect horizontal swipe more than vertical
                if (Math.abs(currentX - touchStartX) > Math.abs(currentY - touchStartY)) {
                    isSwipe = true;
                }
            });

            $(".wepad").on("touchend", function (e) {
                if (!isSwipe) return;

                touchEndX = e.originalEvent.changedTouches[0].clientX;
                var swipeDistance = touchEndX - touchStartX;

                if (swipeDistance > 50) {
                    // 👉 Left to Right — Undo
                    $(this).removeClass("trash");
                } 
                else if (swipeDistance < -50) {
                    // 👈 Right to Left — Mark as Trash
                    $(this).addClass("trash");
                    hapticFeedback(); // Trigger vibration on swipe
                }
            });
        });

        $('.cancel-sms').on('click', function (e) {
            $('body').addClass('mobsms');
        });
        $('.yes-sms').on('click', function (e) {
            $('body').addClass('rdcustom');
        });
        $('.close-addsms').on('click', function (e) {
            $('body').removeClass('rdcustom');
        });

        $('#repmail').on('click', function (e) {
            $('#repnow').addClass('active');
        });
        $('#repcom').on('click', function (e) {
            $('.opour').addClass('active');
            $('.opour2').addClass('active');
            $('.ourhie').addClass('active');
        });
        $('#idsrep').on('click', function (e) {
            $('.idshare').addClass('active');
            $('.idsharebody').addClass('active');
            $('.idsharebottom').addClass('active');
        });

        $(document).on('click', '.modal-backdrop', function () {
            $('body').removeClass('mobsms');
            $('body').removeClass('rdcustom');
            $('#repnow').removeClass('active');
        });

        $(document).ready(function() {
            function toggleButtonAttributes() {
                if ($(window).width() <= 575.98) {
                    // Remove offcanvas attributes and add dropdown attributes to chat button
                    $('.btn.header-item.noti-icon[data-bs-target="#chat"]')
                        .removeAttr('data-bs-toggle')
                        .removeAttr('data-bs-target')
                        .removeAttr('aria-controls')
                        .attr('data-bs-toggle', 'dropdown')
                        .attr('aria-expanded', 'false')
                        .addClass('dropdown-toggle');

                    $('#infoeu').removeAttr('placeholder');
                    $('#infoeu').attr('placeholder', 'Search..')
                    
                    // Remove offcanvas attributes and add dropdown attributes to notification button
                    $('.btn.header-item.noti-icon[data-bs-target="#noti"]')
                        .removeAttr('data-bs-toggle')
                        .removeAttr('data-bs-target')
                        .removeAttr('aria-controls')
                        .attr('data-bs-toggle', 'dropdown')
                        .attr('aria-expanded', 'false')
                        .addClass('dropdown-toggle');
                } else {
                    // Restore original attributes for chat button
                    $('.btn.header-item.noti-icon[data-bs-target="#chat"]')
                        .attr('data-bs-toggle', 'offcanvas')
                        .attr('data-bs-target', '#chat')
                        .attr('aria-controls', 'offcanvasRight')
                        .removeAttr('aria-expanded')
                        .removeClass('dropdown-toggle');
                    
                    // Restore original attributes for notification button
                    $('.btn.header-item.noti-icon[data-bs-target="#noti"]')
                        .attr('data-bs-toggle', 'offcanvas')
                        .attr('data-bs-target', '#noti')
                        .attr('aria-controls', 'offcanvasRight')
                        .removeAttr('aria-expanded')
                        .removeClass('dropdown-toggle');
                }
            }

            // Run on page load
            toggleButtonAttributes();
            
            // Run when window is resized
            $(window).resize(function() {
                toggleButtonAttributes();
            });
        });
    }

    function init() {
        initMetisMenu();
        initLeftMenuCollapse();
        initActiveMenu();
        initMenuItemScroll();
        initDropdownMenu();
        initComponents();
        initAdditional();
    }

    init();

})(jQuery);

// document.getElementById('dateRange').addEventListener('click', function(e) {
//     e.stopPropagation();
// });

(function () {
    const update = () => {
        const backs = Array.from(document.querySelectorAll("body > .modal-backdrop"));
        backs.forEach((b) => b.classList.remove("is-first", "is-last"));
        if (!backs.length) return;
        backs[0].classList.add("is-first");
        backs[backs.length - 1].classList.add("is-last");
    };

    // Watch for Bootstrap adding/removing backdrops
    const mo = new MutationObserver(update);
    mo.observe(document.body, { childList: true });

    // Initial pass
    update();
})();
