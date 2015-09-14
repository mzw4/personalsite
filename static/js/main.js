
var backgrounds_dir = 'backgrounds/'
var banners_dir = 'banners/'

var _projects = ['selfiebot', 'filmrater', 'okra', 'pathogenesis', 'ai_prac'];
var cur_project_index = 0;

var backgrounds = ['IMG_2776.JPG', 'waves.jpg', 'acacia.jpg', 'aquarium.jpg'];
var cur_background_index = 0;
var BACKGROUND_CHANGE_TIME = 10000;
var MENU_FADE_TIME = 1000;

var FADE_SPEED = 200;

var menu_height;

// -------------- Handlebars tempaltes --------------
var sections_template, introduction_content_template, design_content_template,
  hardware_content_template, software_content_template, results_content_template,
  conclusions_content_template, appendix_content_template, circle_template,
  circle_thin_template;

$(function() {

  // -------------- Program vars --------------  
  var $body = $('body');
  var $sections = $('#sections')
  var $title_content = $('#title_content');
  var $title_panel = $('#title_panel')
  var $menu = $('#menu');
  var $menu_background = $('#menu_background')
  var $menu_mask = $('.dark_cover');

  var $main_content_panel = $('#main_content_panel');
  var $sections = $('#sections');
  var $section_wrappers;
  var $footer = $('.footer');
  var $parallax;

  var view_port_dim = {x: $(window).width(), y: $(window).height()};

  // -------------- Init Skrollr --------------
  var Skrollr = skrollr.init();

  // -------------- Initialize page --------------
  // $title_panel.height(view_port_dim.y);

  // Affix the menu bar to the top
  $menu.affix({
    offset: {
      top: $menu.offset().top,
    }
  })
  menu_height = $menu.height();
  $('#menu_wrapper').height(menu_height);

  // console.log(CONTENT_DIR);

  // Set the background and timer to change it occasionally
  $menu_background.css({'background-image': 'url(' + CONTENT_DIR + backgrounds_dir + backgrounds[cur_background_index] + ')'});
  changeBackground();
  console.log(CONTENT_DIR);

  // Fade in the content
  $title_content.delay(500).css({'visibility':'visible'}).hide().fadeIn(500, function() {
    populate_page();
    Skrollr.refresh();
    $main_content_panel.fadeIn(500);
    $footer.fadeIn(500);
  });

  // Animate line
  $('.line').delay(200).animate({
    width: '500px'
  }, 1000);

  // -------------- Event bindings --------------

  // Scroll to the section when the menu is clicked
  $('#menu a').on('click', function(e) {
    e.preventDefault();
    $('body').animate({
        scrollTop: $($(this).attr('href')).offset().top - menu_height
    }, 500, 'swing');
  });

  $sections.on('click', '.gallery_button', function(e) {
    e.preventDefault();
    if($(this).data('dir') === 'left') {
      new_project_index = ((cur_project_index - 1) % _projects.length + _projects.length) % _projects.length;
    } else {
      new_project_index = (cur_project_index + 1) % _projects.length;
    }

    showProject(new_project_index, cur_project_index);
  });

  // Click on project gallery paginator
  $sections.on('click', '.gallery_index_button', function(e) {
    e.preventDefault();
    showProject(parseInt($(this).data('index')), cur_project_index);
  });

  // Click on project nav item
  $sections.on('click', '#project_nav .nav_items li', function(e) {
    e.preventDefault();
    showProject(parseInt($(this).data("index")), cur_project_index)
  });

  function toggleSection($paragraph) {
    if($paragraph.data('toggle') === 'on') {
      $paragraph.data('toggle', 'off');
      $paragraph.find('.statement_text').fadeOut(FADE_SPEED, function() {
        $paragraph.find('.block_summary').fadeIn(FADE_SPEED);
      });
      $paragraph.find('.expand_icon').removeClass('rotate_cw');
    } else {
      $paragraph.data('toggle', 'on');
      $paragraph.find('.block_summary').fadeOut(FADE_SPEED, function() {
        $paragraph.find('.statement_text').fadeIn(FADE_SPEED);
      });
      $paragraph.find('.expand_icon').addClass('rotate_cw');
    }
  }

  $sections.on('click', '#statement .block_text_wrapper', function(e) {
    toggleSection($(this));
  });

  $sections.on('click', '#statement #expand_all', function(e) {
    toggleSection($(this));
    $('#statement').find('.block_text_wrapper').each(function() {
      toggleSection($(this));
    });
  });

  $sections.on('click', '#statement_nav a', function(e) {
    e.preventDefault();
    $paragraph = $($(this).attr('href'));
    $('body').animate({
        scrollTop: $paragraph.offset().top - menu_height - 15
    }, 500, 'swing');
    toggleSection($paragraph);
  });

  // -------------- Functions --------------

  // Periodically change the background image
  function changeBackground() {
    setTimeout(function() {
      cur_background_index = (cur_background_index + 1) % backgrounds.length;
      setBackground(cur_background_index);
      changeBackground();
    }, BACKGROUND_CHANGE_TIME);
  }

  function populate_page() {
    sections_template = Handlebars.compile($('#sections_template').html());
    // personal_statement_content_template = Handlebars.compile($('#personal_statement_content_template').html());
    // resume_content_template = Handlebars.compile($('#resume_content_template').html());
    projects_content_template = Handlebars.compile($('#projects_content_template').html());
    project_template = Handlebars.compile($('#project_template').html());
    // interests_content_template = Handlebars.compile($('#interests_content_template').html());
    // contact_content_template = Handlebars.compile($('#contact_content_template').html());
    circle_template = Handlebars.compile($('#circle_template').html());
    circle_thin_template = Handlebars.compile($('#circle_thin_template').html());

    // Populate the page content
    var section_info = [
      {
        section_id: 'summary',
        title: 'Summary',
        img_src: CONTENT_DIR + banners_dir + 'graph2.jpg',
        content: '',
      },
      {
        section_id: 'projects',
        title: 'Projects',
        img_src: CONTENT_DIR + banners_dir + 'graph2.jpg',
        content: '',
      },
      {
        section_id: 'statement',
        title: 'Statement of Purpose',
        img_src: CONTENT_DIR + banners_dir + 'graph2.jpg',
        content: '',
      },
      {
        section_id: 'resume',
        title: 'Resume',
        img_src: CONTENT_DIR + banners_dir + 'graph2.jpg',
        content: '',
      },
      {
        section_id: 'interests',
        title: 'Interests',
        img_src: CONTENT_DIR + banners_dir + 'mountains.jpg',
        content: '',
      },
    ];

    // Build content sections and set parameters
    $sections.html(sections_template({ 'sections': section_info }));
    section_info.forEach(function(section) {
      $('#' + section.section_id + ' .banner').css({'background-image': 'url(' + section.img_src + ')'});
    });

    $section_wrappers = $('.section_panel');
    $parallax = $('.parallax');

    // Set the height of each section to the height of the view port
    var title_height = $('.banner_wrapper').height();
    // $section_wrappers.css({'min-height': view_port_dim.y - menu_height - title_height });

    // TEMP
    $statement_content = $('#statement .section_content');
    $summary_content = $('#summary .section_content');
    $interests_content = $('#interests .section_content');

    var sections = ['statement_of_purpose', 'summary', 'interests']
    $.get('ajax_get_section_templates', payload = { sections: JSON.stringify(sections) })
      .done(function(section_templates) {
        // TEMP
        $statement_content.html(section_templates['statement_of_purpose']);
        $summary_content.html(section_templates['summary']);
        $interests_content.html(section_templates['interests']);
      });

    // Load projects
    $project_content = $('#projects .section_content');

    $.get('ajax_get_project_templates')
      .done(function(data) {
        if(data && 'data' in data) {
          project_data = data['data'];
          _projects = project_data.map(function(project) { return project['id']; });
          project_names = project_data.map(function(project) { return project['name']; });
          project_templates = {}
          project_data.forEach(function(project) {
            project_templates[project['id']] = project['template'];
          });

          $project_content.html(projects_content_template({
            'project_templates': project_templates,
            'project_names': project_names
          }));

          $('.project_gallery').magnificPopup({
            delegate: 'a',
            type:'image',
            closeOnContentClick: false,
            closeBtnInside: false,
            removalDelay: 300,
            mainClass: 'mfp-with-zoom mfp-img-mobile',
            image: {
              verticalFit: true,
              // titleSrc: function(item) {
              //   return item.el.attr('title') + ' &middot; <a class="image-source-link" href="'+item.el.attr('data-source')+'" target="_blank">image source</a>';
              // }
            },
            gallery: {
              enabled: true
            },
            zoom: {
              enabled: true, // By default it's false, so don't forget to enable it
              duration: 300, // duration of the effect, in milliseconds
              easing: 'ease-in-out', // CSS transition easing function 

              // The "opener" function should return the element from which popup will be zoomed in
              // and to which popup will be scaled down
              // By defailt it looks for an image tag:
              opener: function(openerElement) {
                // openerElement is the element on which popup was initialized, in this case its <a> tag
                // you don't need to add "opener" option if this code matches your needs, it's defailt one.
                return openerElement.is('img') ? openerElement : openerElement.find('img');
              }
            }
          });

          // $('.project_gallery').find('img').each(function() {
          //   $(this).on('load', function() {
          //     // $(this).css({ 'left': $(this).width()/2, 'right': $(this).height()/2 });
          //     console.log($(this)[0].src)
          //     console.log($(this).width());
          //     console.log($(this).height());
          //   });
          // });
          
          // set the gallery for the first project
          $('#' + _projects[cur_project_index] + '_project').show();
          $('.gallery_index').find('[data-index="' + cur_project_index + '"]')
            .removeClass('fa-circle-thin').addClass('fa-circle');
        }
      });

    speed = 0.6;
    window.onscroll = function() {
      var offset_y = $(window).scrollTop() + 130 - menu_height;
      $parallax.css({
        'background-position': '0 ' + (offset_y * speed) + 'px',
      })
    };

    Skrollr.refresh();
  }

  /*
   * Show the project at the specified new index
   */
  function showProject(new_index, cur_index) {
    $('#' + _projects[cur_index] + '_project').fadeOut(200, function() {
      $('#' + _projects[new_index] + '_project').fadeIn(200);

      // color in icon
      $('.gallery_index').find('[data-index="' + cur_project_index + '"]')
        .removeClass('fa-circle').addClass('fa-circle-thin');
      $('.gallery_index').find('[data-index="' + new_index + '"]')
        .removeClass('fa-circle-thin').addClass('fa-circle');

      cur_project_index = new_index;
    });
  }

  /*
   * Set the menu background as the specified image index
   */
  function setBackground(background_index) {
    $menu_mask.animate({ 'opacity': 1.0 }, MENU_FADE_TIME, function() {
      $menu_background.css({'background-image': 'url(' + CONTENT_DIR + backgrounds_dir + backgrounds[background_index] + ')'});
      $menu_mask.delay(1000).animate({ 'opacity': 0.4 }, MENU_FADE_TIME);
    });
  }

});