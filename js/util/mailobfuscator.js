// From http://www.jottings.com/obfuscator/
const mail_coded = 'S8BWu@S8BWuCNY.w8'
const mail_key = 'v2CoGMhaPySm3EtKQBHO6FXxiAJ1wUg9l0InZcsbdWep5zRrD4VfuLjkY7T8Nq'
const mail_shift = mail_coded.length

let mail_link = ''
let mail_ltr = ''

for (let i = 0; i < mail_coded.length; i++) {
  if (mail_key.indexOf(mail_coded.charAt(i)) == -1) {
    mail_ltr = mail_coded.charAt(i)
    mail_link += mail_ltr
  } else {
    mail_ltr =
      (mail_key.indexOf(mail_coded.charAt(i)) - mail_shift + mail_key.length) % mail_key.length
    mail_link += mail_key.charAt(mail_ltr)
  }
}

function setMailById(elementId, href=false, content=false) {
  element = document.getElementById(elementId)

  if (href)
    element.href = `mailto:${mail_link}`

  if (content)
    element.text = `${mail_link}`
}
