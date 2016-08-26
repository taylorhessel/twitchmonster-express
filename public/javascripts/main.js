"use strict";

$(() => {

  //GLOBALS
  let streamCounter = 0;

  //ADD CHANNEL INPUT
  $('#add-stream').on('click', () => {
    if ($('#welcome input').length <= 4) {
      streamCounter++;
      $('#welcome-form-additional-inputs').append(addInput(streamCounter));
      $('.channel-input').last().focus();
    }
  });

  // ADD CHANNEL INPUT AND REMOVE BUTTON HTML
  function addInput(streamCounter) {
    return "<div class='added-input-row group'>\
              <div class='added-input-wrapper'>\
                <input type='text' name='channel-" + streamCounter + "' id='channel-" + streamCounter + "'class='form-control channel-input added-input' placeholder='Enter a channel name here'>\
                <span class='icon glyphicon'></span>\
              </div>\
              <button type='button' class='remove-stream btn-primary btn glyphicon glyphicon-remove'></button>\
            </div>"
  }

  //REMOVE CHANNEL INPUT
  $('form').on('click', '.remove-stream', (e) => {
    $(e.target).closest('.added-input-row').remove();
    $('.channel-input').last().focus();
  });

  //DYNAMICALLY VALIDATE CHANNEL NAMES AND STREAM STATUS
  $('form').on('keyup', '.channel-input', (e) => {
    delay(() => {
      $.get('https://api.twitch.tv/kraken/streams/' + $(e.target).val(), (data) => {
        if ($(e.target).val() !== '' && data.stream !== null) {
          $(e.target).parent()
            .find('span')
            .removeClass('glyphicon-remove invalid')
            .addClass('glyphicon-ok valid')
          $(e.target).addClass('online');
        } else if (data.stream === null) {
          $(e.target).parent()
            .find('span')
            .removeClass('glyphicon-ok valid')
            .addClass('glyphicon-remove invalid')
          $(e.target).removeClass('online');
        } else {
          $(e.target).parent()
            .find('span')
            .removeClass('glyphicon-remove glyphicon-ok')
          $(e.target).removeClass('online');
        }
      })
      .fail((data) => {
        if ($(e.target).val() !== '') {
          $(e.target).parent()
            .find('span')
            .removeClass('glyphicon-ok valid')
            .addClass('glyphicon-remove invalid')
        }
      });
    }, 500);
  });

  //DELAY USED WITH DYNAMIC VALIDATION
  let delay = (() => {
    let timer = 0;
    return function(callback, ms){
      clearTimeout (timer);
      timer = setTimeout(callback, ms);
    };
  })();

  // LOAD ONLINE STREAMS AND CHATS
  $('form').on('submit', (e) => {
    e.preventDefault();
    let vWidth = window.innerWidth;
    let vHeight = window.innerHeight;
    let onlineStreams = [];
    $('.online').each((i, el) => {
      let $channelName = $(el);
      onlineStreams.push($channelName.val());
    });
    let onlineCount = onlineStreams.length;
    if (onlineCount === 1) {
      $('#welcome').animate({opacity: 0}, 300, () => {
        $('#welcome').remove();
        for (let stream in onlineStreams) {
          $('#stream-wrapper').append('<div id="stream-' + stream + '" class="full-width full-height"></div>');
          $('body').append(createPlayer(onlineStreams[stream], vWidth * 0.8, vHeight, 'stream-' + stream));
          $('#chat-wrapper').addClass('single-chat');
          $('#chat-wrapper').append(createChat(onlineStreams[stream], vWidth * 0.2, vHeight));
        }
      });
    } else if (onlineCount === 2) {
      $('#welcome').animate({opacity: 0}, 300, () => {
        $('#welcome').remove();
        for (let stream in onlineStreams) {
          $('#stream-wrapper').append('<div id="stream-' + stream + '" class="full width half-height"></div>');
          if (stream == 0) {
            $('body').append(createPlayer(onlineStreams[stream], vWidth * 0.8, vHeight * 0.5, 'stream-' + stream));
            $('.nav-pills').append('<li role="trigger" class="active"><a href="#' + onlineStreams[stream] + '" aria-controls="' + onlineStreams[stream] + '" role="tab" data-toggle="tab">' + truncate(onlineStreams[stream], 7) + '</a></li>');
            $('.tab-content').append('<div role="tabpanel" class="tab-pane active" id="' + onlineStreams[stream] + '"></div>');
            $('#' + onlineStreams[stream]).append(createChat(onlineStreams[stream], vWidth * 0.2, vHeight - 40));
          } else {
            $('body').append(createPlayer(onlineStreams[stream], vWidth * 0.8, vHeight * 0.5, 'stream-' + stream, true));
            $('.nav-pills').append('<li role="trigger"><a href="#' + onlineStreams[stream] + '" aria-controls="' + onlineStreams[stream] + '" role="tab" data-toggle="tab">' + truncate(onlineStreams[stream], 7) + '</a></li>');
            $('.tab-content').append('<div role="tabpanel" class="tab-pane" id="' + onlineStreams[stream] + '"></div>');
            $('#' + onlineStreams[stream]).append(createChat(onlineStreams[stream], vWidth * 0.2, vHeight - 40));
          }
        }
      });
    } else if (onlineCount === 3) {
      $('#welcome').animate({opacity: 0}, 300, () => {
        $('#welcome').remove();
        $('#stream-wrapper').css('display', 'block');
        for (let stream in onlineStreams) {
          if (stream == 0) {
            $('#stream-wrapper').append('<div id="stream-' + stream + '" class="full-width half-height left"></div>');
            $('body').append(createPlayer(onlineStreams[stream], vWidth * 0.8, vHeight * 0.5, 'stream-' + stream));
            $('.nav-pills').append('<li role="trigger" class="active"><a href="#' + onlineStreams[stream] + '" aria-controls="' + onlineStreams[stream] + '" role="tab" data-toggle="tab">' + truncate(onlineStreams[stream], 7) + '</a></li>');
            $('.tab-content').append('<div role="tabpanel" class="tab-pane active" id="' + onlineStreams[stream] + '"></div>');
            $('#' + onlineStreams[stream]).append(createChat(onlineStreams[stream], vWidth * 0.2, vHeight - 40));
          } else {
            $('#stream-wrapper').append('<div id="stream-' + stream + '" class="half-width half-height right"></div>');
            $('body').append(createPlayer(onlineStreams[stream], vWidth * 0.4, vHeight * 0.5, 'stream-' + stream, true));
            $('.nav-pills').append('<li role="trigger"><a href="#' + onlineStreams[stream] + '" aria-controls="' + onlineStreams[stream] + '" role="tab" data-toggle="tab">' + truncate(onlineStreams[stream], 7) + '</a></li>');
            $('.tab-content').append('<div role="tabpanel" class="tab-pane" id="' + onlineStreams[stream] + '"></div>');
            $('#' + onlineStreams[stream]).append(createChat(onlineStreams[stream], vWidth * 0.2, vHeight - 40));
          }
        }
      });
    } else if (onlineCount === 4) {
        $('#welcome').animate({opacity: 0}, 300, () => {
          $('#welcome').remove();
          $('#stream-wrapper').css('display', 'block');
          for (let stream in onlineStreams) {
            if (stream == 0) {
              $('#stream-wrapper').append('<div id="stream-' + stream + '" class="half-width half-height left"></div>');
              $('body').append(createPlayer(onlineStreams[stream], vWidth * 0.4, vHeight * 0.5, 'stream-' + stream));
              $('.nav-pills').append('<li role="trigger" class="active"><a href="#' + onlineStreams[stream] + '" aria-controls="' + onlineStreams[stream] + '" role="tab" data-toggle="tab">' + truncate(onlineStreams[stream], 7) + '</a></li>');
              $('.tab-content').append('<div role="tabpanel" class="tab-pane active" id="' + onlineStreams[stream] + '"></div>');
              $('#' + onlineStreams[stream]).append(createChat(onlineStreams[stream], vWidth * 0.2, vHeight - 40));
            } else if (stream == 2) {
              $('#stream-wrapper').append('<div id="stream-' + stream + '" class="half-width half-height left"></div>');
              $('body').append(createPlayer(onlineStreams[stream], vWidth * 0.4, vHeight * 0.5, 'stream-' + stream, true));
              $('.nav-pills').append('<li role="trigger"><a href="#' + onlineStreams[stream] + '" aria-controls="' + onlineStreams[stream] + '" role="tab" data-toggle="tab">' + truncate(onlineStreams[stream], 7) + '</a></li>');
              $('.tab-content').append('<div role="tabpanel" class="tab-pane" id="' + onlineStreams[stream] + '"></div>');
              $('#' + onlineStreams[stream]).append(createChat(onlineStreams[stream], vWidth * 0.2, vHeight - 40));
            } else {
              $('#stream-wrapper').append('<div id="stream-' + stream + '" class="half-width half-height right"></div>');
              $('body').append(createPlayer(onlineStreams[stream], vWidth * 0.4, vHeight * 0.5, 'stream-' + stream, true));
              $('.nav-pills').append('<li role="trigger"><a href="#' + onlineStreams[stream] + '" aria-controls="' + onlineStreams[stream] + '" role="tab" data-toggle="tab">' + truncate(onlineStreams[stream], 7) + '</a></li>');
              $('.tab-content').append('<div role="tabpanel" class="tab-pane" id="' + onlineStreams[stream] + '"></div>');
              $('#' + onlineStreams[stream]).append(createChat(onlineStreams[stream], vWidth * 0.2, vHeight - 40));
            }
          }
        });
    } else { //ERROR HANDLING
      $('#error')
        .addClass('text-danger')
        .text('Please enter at least one online channel.')
        .fadeIn(500)
        .delay(3000)
        .fadeOut(500)
    }
  });

  //TRUNCATE
  function truncate(str, length) {
    return str.length > length ? str.substring(0, length) : str
  }

  //RESIZE ON RESIZE
  $(window).resize(() => {

    let $allVideos = $('iframe[src^="https://player.twitch.tv"]');
    let $allChats = $('iframe[src^="https://www.twitch.tv"]');
    let $streamWrapper = $('#stream-wrapper');
    let $chatWrapper = $('#chat-wrapper');
    let newChatWidth = Math.floor($chatWrapper.width());
    let newChatHeight = Math.floor($chatWrapper.height());
    let newMultiChatHeight = Math.floor($chatWrapper.height() - 40);
		let newStreamWidth = Math.floor($streamWrapper.width());
    let newStreamWidthHalf = Math.floor($streamWrapper.width() * 0.5);
    let newStreamHeight = Math.floor($streamWrapper.height());
    let newStreamHeightHalf = Math.floor($streamWrapper.height() * 0.5);

    $allVideos.each((i, el) => {
			let $el = $(el);

      if ($el.closest('div').hasClass('half-height')) {
			  $el.height(newStreamHeightHalf);
      } else {
        $el.height(newStreamHeight);
      }

      if ($el.closest('div').hasClass('half-width')) {
        $el.width(newStreamWidthHalf);
      } else {
        $el.width(newStreamWidth);
      }
		});

    $allChats.each((i, el) => {
      let $el = $(el);

      if ($el.closest('section').hasClass('single-chat')) {
        $el.width(newChatWidth);
        $el.height(newChatHeight);
      } else {
        $el.width(newChatWidth);
        $el.height(newMultiChatHeight);
      }
    });

  });

  //ADD PLAYER SCRIPT
  function createPlayer(channel, width, height, streamContainer, muted = false) {
    return "<script type='text/javascript'>\
               let options = {\
                 width: " + width + ",\
                 height: " + height + ",\
                 channel: '" + channel + "',\
               };\
               let player = new Twitch.Player('" + streamContainer + "', options);\
               player.setVolume(0.5);\
               player.setMuted(" + muted + ");\
           </script>";
  }

  //ADD CHAT SCRIPT
  function createChat(channel, width, height) {
    return "<iframe frameborder='0'\
               scrolling='no'\
               id='chat_embed'\
               src='https://www.twitch.tv/" + channel + "/chat'\
               width=" + width + "\
               height=" + height + ">\
           </iframe>"
  }

  //CHAT TAB CLICK LISTENER
  $('.nav-pills a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
  });

}).resize();
