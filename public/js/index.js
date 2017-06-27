
var socket= io()
socket.on('connect',function()
{
    console.log("Connected to Server")
})
socket.on('disconnect',function()
{
    console.log("Server disconnected")
})
socket.on('newMessage',function(Email)
{
   var formattedTime = moment(Email.createdAt).format('h:mm a')
   var template = jQuery('#message-template').html()
    var html = Mustache.render(template,{
       text:Email.text,
       from:Email.from,
        createdAt:formattedTime
    })
    jQuery('#messages').append(html)
})

jQuery('#message-form').on('submit',function (e) {
    e.preventDefault()

    socket.emit('createMessage',{
        from:'User',
        text: jQuery('[name=message]').val()
    },function () {
        jQuery('[name=message]').val("")
    })
})
socket.on('newLocation',function (loc) {
    var formatTime = moment(loc.createdAt).format('h:mm a')
    var locationTemplate =jQuery('#location-message-template').html()
    var html = Mustache.render(locationTemplate,
        {
            from:loc.from,
            createdAt:formatTime,
            url:loc.url
        })
    jQuery('#messages').append(html)
})
var locationBtn = jQuery('#send-location')
locationBtn.on('click',function () {
    if(!navigator.geolocation)
    {
        return alert("Geolocation not available")
    }
    locationBtn.attr('disabled','disabled').text('Sending location...')
      navigator.geolocation.getCurrentPosition(function (position) {
          locationBtn.removeAttr('disabled').text('Send location')
        socket.emit('createLocation',{
            lat:position.coords.latitude,
            lng :position.coords.longitude
        })
      },function () {
          locationBtn.removeAttr('disabled').text('Send location')
          alert('Unable to fetch location')
      })

})