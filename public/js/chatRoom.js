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
            socket.emit('new-user', params, function(err) {
                if (err) {
                    alert(err);
                    window.location.href = '/';
                } else {
                    console.log('No Error occur');
                }
            })
        });

        socket.on('disconnect', function() {
            console.log('Disconected from the server');
        })

        socket.on('updateUsersList', function(users) {
            let ol = document.createElement('ol');

            users.forEach(function (user) {
                let li = document.createElement('li')
                li.innerHTML = user;
                ol.appendChild(li);
            });
            
            let userList = document.querySelector('#usersOnline');
            userList.innerHTML = '';
            userList.appendChild(ol);

        });

        function renderMessage(message) {
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

            var message = $('input[name=message]').val();

            if (message.length) {
                var msgObject = {
                    message: message,
                    createdAt: new Date().getTime()
                };
                socket.emit('createMessage', msgObject);
                $('input[name=message]').val('');
            };
        });

