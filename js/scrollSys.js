const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) =>{
        console.log(entry)
        if (entry.isIntersecting) {
            entry.target.classList.add('s_show')
        }
        else
        {
            entry.target.classList.remove('s_show')
        }
    })
})

const hiddenElements = document.querySelectorAll('.s_hidden')
const hiddenElementsI = document.querySelectorAll('.s_hidden_i')
hiddenElements.forEach((el) =>observer.observe(el))
hiddenElementsI.forEach((el) =>observer.observe(el))