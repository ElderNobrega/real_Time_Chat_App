var socket = io();
        
        function scrollDown() {
            let msg = document.querySelector('#message').lastElementChild;
            msg.scrollIntoView();
        }

        socket.on('connect', function() {
            let searchQuery = window.location.search.substring(1);
            let params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');
            
            socket.emit('join', params, function(err) {
                if (err) {
                    alert(err);
                    window.location.href = '/';
                } else {
                    console.log('No Error occur');
                }
            })
        });

        function renderMessage(message) {
            /*const template = document.querySelector('message-template').innerHTML;
            const html = Mustache.render(template);
            const div = document.createElement('div');

            div.innerHTML = html;

            $('.messages').appendChild(div);
            */
            const formattedTime = moment(message.createdAt).format('LT');
            $('#message').append('<li><strong>'+ message.author + '</strong>: ' + message.message + " "+ formattedTime+ '</li>')
            
        }

        socket.on('newMessage', function(message){
            //renderMessage(message);
            const template = document.querySelector('#message-template').innerHTML;
            const formattedTime = moment(message.createdAt).format('LT');
            const html = Mustache.render(template, {
                author: message.author,
                message: message.message,
                createdAt: formattedTime   
            });
            let li = $('#message').append(html);
            $('ol[id=message]').add(li);
            scrollDown();
            //let li = $('#message').append('<li><strong>' + message.author + '</strong> ' + formattedTime + ': ' + message.message + '</li>' )
            //$('ol[id=message]').add(li)
        });     

        $('#chat').submit(function(event){
            event.preventDefault();

            var author = $('input[name=username]').val();
            var message = $('input[name=message]').val();

            if (author.length && message.length) {
                var msgObject = {
                    author: author,
                    message: message,
                    createdAt: new Date().getTime()
                };

                socket.emit('createMessage', msgObject);

                //socket.emit('sendMessage', msgObject);
            }
        })