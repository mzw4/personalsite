
$(function() {
  // -------------- Program vars --------------

  var $body = $('body');
  var $title_content = $('#title_content');
  var $title_panel = $('#title_panel')
  var $menu = $('#menu');
  var $menu_background = $('#menu_background')

  var $main_content_panel = $('#main_content_panel');
  var $sections = $('#sections');
  var $section_panels;
  var $footer = $('.footer');
  var $parallax;

  var content_dir = 'content/'
  var backgrounds_dir = 'backgrounds/'
  var menu_height;
  var view_port_dim = {x: $(window).width(), y: $(window).height()};

  // -------------- Handlebars tempaltes --------------

  var sections_template = Handlebars.compile($('#sections_template').html());
  var resume_content_template = Handlebars.compile($('#resume_content_template').html());

  // -------------- Initialize page --------------

  // Populate the page content
  var section_info = [
    {
      section_id: 'personal_statement',
      title: 'Personal Statement',
      img_src: 'content/graph2.jpg',
    },
    {
      section_id: 'resume',
      title: 'Resume',
      content: resume_content_template({}),
      img_src: 'content/graph2.jpg',
    },
    {
      section_id: 'projects',
      title: 'Projects',
      img_src: 'content/graph2.jpg',
    },
    {
      section_id: 'interests',
      title: 'Interests',
      img_src: 'content/mountains.jpg',
    },
    {
      section_id: 'contact',
      title: 'Contact',
      img_src: 'content/graph1.png',
    },
  ];

  // Build content sections and set parameters
  $sections.html(sections_template({ 'sections': section_info }));
  section_info.forEach(function(section) {
    $('#' + section.section_id + ' .banner').css({'background-image': 'url(' + section.img_src + ')'});
  });

  backgrounds = ['IMG_2986.JPG']
  $menu_background.css({'background-image': 'url(' + content_dir + backgrounds_dir + backgrounds[0] + ')'});

  $section_panels = $('.section_panel')
  $parallax = $('.parallax');
  $title_panel.height(view_port_dim.y);

  // Affix the menu bar to the top
  $menu.affix({
    offset: {
      top: $menu.offset().top,
    }
  })
  menu_height = $menu.height();
  $('#menu_wrapper').height(menu_height);

  // Set the height of each section to the height of the view port
  $section_panels.css({'min-height': view_port_dim.y - menu_height});

  // Fade in the content
  $title_content.delay(500).css({'visibility':'visible'}).hide().fadeIn(500, function() {
    $main_content_panel.fadeIn(500);
    $footer.fadeIn(500);
  });

  // Animate line
  $('.line').delay(200).animate({
    width: '50%'
  }, 1000);

  // -------------- Event bindings --------------

  // Scroll to the section when the menu is clicked
  $('#menu a').on('click', function(e) {
    e.preventDefault();
    $('body').animate({
        scrollTop: $($(this).attr('href')).offset().top - menu_height
    }, 500, 'swing');
  });

  speed = 0.5;
  window.onscroll = function() {
    var offset_y = $(window).scrollTop()
    $parallax.css({
      'background-position': '0 ' + (offset_y * speed) + 'px',
    })
  };

  // -------------- Functions --------------

  function changeBackground() {

    setTimeout(10000);  // wait 10 seconds
  }

});