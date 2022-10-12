const socket = io.connect() //io bağlantısı

let sender //kullanıcı
let senderSL = false //isim seçme dedektörü, false = isim seçilmemiş, true = isim seçilmiş
let message = document.getElementById('message') //input
let sendBtn = document.getElementById('submitBtn') //gönder butonu
let output = document.getElementById('output') //mesaj çıktısı
let feedback = document.getElementById('feedback') //yazıyor... durumu

sendBtn.addEventListener('click', sendFunc) //gönder buttonu tıklama dinleyicisi
function sendFunc() {
    if (message.value.includes("/setname ") && senderSL == false && message.value.startsWith("/setname ") && message.value.length <= 19) {  //eğer mesaj yerinde /setname geçiyor ise, senderSL false ise, /setname ile başlıyor ise ve toplam 19 karakter veya daha küçük bir karakter ise
        sender = message.value.slice(9) //"/setname" yerinden sonraki yazıları gönderici olarak ata
        senderSL = true //isim seçildi bildirisi
        message.placeholder = 'Your name: ' + message.value.slice(9) //mesaj kısmına placeholder ile "Senin adın {isim}" yazdır
        message.value = '' //işlemler yapıldıktan sonra mesaj yerini temizle
    }
    else if (message.value.startsWith("/setname ") && message.value.length >= 20) {
        alert('Your name can be a maximum of 10 characters.')
    }
    else if (message.value == "/setname") {
        alert('You must enter a name to use the /setname command.')
    }
    else if (message.value.startsWith("/") && message.value.includes("/setname ") == false) {
        alert('Invalid command, did you mean /setname?')
    }
    else if (senderSL == false) {
        alert('Name not detected, select a name to write message.')
    }
    else if (message.value.includes("/setname") && senderSL == true && message.value.startsWith("/setname")) {
        alert('You already have a name.')
    }
    else if (senderSL == true && !message.value.trim() == false) {
        socket.emit('chat', {
            message: message.value,
            sender: sender
        })
    }
    else if (!message.value.trim()) {
        alert('Invalid message.')
    }
}
document.addEventListener('keyup', entFunc)
function entFunc(e) {
    if (e.keyCode == 13) {
        if (message.value.includes("/setname ") && senderSL == false && message.value.startsWith("/setname ") && message.value.length <= 19) {  //eğer mesaj yerinde /setname geçiyor ise, senderSL false ise, /setname ile başlıyor ise ve toplam 19 karakter veya daha küçük bir karakter ise
            sender = message.value.slice(9) //"/setname" yerinden sonraki yazıları gönderici olarak ata
            senderSL = true //isim seçildi bildirisi
            message.placeholder = 'Your name: ' + message.value.slice(9) //mesaj kısmına placeholder ile "Senin adın {isim}" yazdır
            message.value = '' //işlemler yapıldıktan sonra mesaj yerini temizle
        }
        else if (message.value.startsWith("/setname ") && message.value.length >= 20) {
            alert('Your name can be a maximum of 10 characters.')
        }
        else if (message.value == "/setname") {
            alert('You must enter a name to use the /setname command.')
        }
        else if (message.value.startsWith("/") && message.value.startsWith("/setname ") == false) {
            alert('Invalid command, did you mean /setname?')
        }
        else if (senderSL == false && message.value.startsWith("/")) {
            alert('Name not detected, select a name to write message.')
        }
        else if (message.value.includes("/setname") && senderSL == true && message.value.startsWith("/setname")) {
            alert('You already have a name.')
        }
        else if (senderSL == true && !message.value.trim() == false) {
            socket.emit('chat', {
                message: message.value,
                sender: sender
            })
        }
        else if (!message.value.trim()) {
            alert('Invalid message.')
        }
    }
}

socket.on('chat', data => {
    feedback.innerHTML = ''
    output.innerHTML += '<p><strong>' + data.sender + ':</strong>' + data.message + '</p>'
    message.value = ''
})

message.addEventListener('keyup', typingFunc)
function typingFunc(entKey) {
    if (senderSL == true && message.value.startsWith("/setname ") == false && message.value.startsWith("/") == false && entKey.keyCode != 13 && entKey.keyCode != 20 && entKey.keyCode != 16 && entKey.keyCode != 17 && entKey.keyCode != 91 && entKey.keyCode != 9 && entKey.keyCode != 27 && entKey.keyCode != 112 && entKey.keyCode != 113 && entKey.keyCode != 114 && entKey.keyCode != 115 && entKey.keyCode != 116 && entKey.keyCode != 117 && entKey.keyCode != 118 && entKey.keyCode != 119 && entKey.keyCode != 120 && entKey.keyCode != 121 && entKey.keyCode != 122 && entKey.keyCode != 123 && entKey.keyCode != 8 && entKey.keyCode != 93 && entKey.keyCode != 192 && entKey.keyCode != 145 && entKey.keyCode != 19 && entKey.keyCode != 45 && entKey.keyCode != 36 && entKey.keyCode != 33 && entKey.keyCode != 46 && entKey.keyCode != 35 && entKey.keyCode != 34 && entKey.keyCode != 37 && entKey.keyCode != 38 && entKey.keyCode != 39 && entKey.keyCode != 40 && entKey.keyCode != 144) {
        socket.emit('typing', sender)
    }
}

socket.on('typing', data => {
    feedback.innerHTML += '<p>' + data + ' typing<p id="n1">.</p><p id="n2">.</p><p id="n3">.</p></p>'
    let n1 = document.getElementById('n1');
    let n2 = document.getElementById('n2');
    let n3 = document.getElementById('n3');
    let counter = 1;
    function autoColor() {
        if (counter == 1) {
            counter++
            n1.style.color = 'gray'
            n3.style.color = 'white'
        }
        else if (counter == 2) {
            counter++
            n1.style.color = 'white'
            n2.style.color = 'gray'
        }
        else if (counter == 3) {
            counter = 1
            n2.style.color = 'white'
            n3.style.color = 'gray'
        }
    }
    // clear feedback after one second of inactivity
    setTimeout(() => {
        feedback.innerHTML = ''
    }, 5000);
    let timer = setInterval(autoColor, 250);
})
