export default function TimeTrans(time) {
    if(time) {
        let Time = new Date(time)
        const month = ["01","02","03","04","05","06","07","08","09",10,11,12]
        return `${Time.getDate()}/${month[Time.getMonth()]}/${Time.getFullYear()}`
    }
    return "Chưa thiết lập"
}