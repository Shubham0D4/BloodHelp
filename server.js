const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { dir } = require("console");
const multer  = require('multer');
const nodemailer = require('nodemailer');
const askdb = require('/home/shubham/Shubham/Web/Web-Projects/BloodBank/src/bloodhelp/quries')
const twilio = require("twilio")
const dotenv = require("dotenv")
const fav = require("serve-favicon")

const app = express();

dotenv.config()



app.use(fav(__dirname + '/public/images/favicon.jpeg'))
app.set('view engine', 'ejs');
app.set("views", path.resolve("./views"))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.static('public'));

//error free
app.get('/bloodbanks', async (req, res) => {
    try {
        const locationData = await askdb.getLocation(); 
        console.log(locationData)
        res.json(locationData);
    } catch (error) {
        console.error('Error fetching blood banks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


function sendsms(number){
    const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
    return client.messages
    .create({body:'Hey there! Hope you are doing well. We are currently facing a shortage of blood of your blood type at BloodHelp. Your donation could make a huge difference and save lives. Could you please consider donating at your earliest convenience? Your generosity could truly help someone in need. Thank you so much!', from:'+13344906935', to:number})
    .then(message => {
        console.log(message, 'sent')
        
    })
    .catch(error => console.log(error, 'not sent'))
}
function agefinder(birthdate) {
    const birthDate = new Date(birthdate);
    const currentDate = new Date();
    const differenceMs = currentDate - birthDate;
    const ageDate = new Date(differenceMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    return age;
}

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/bloodhelp.html")
})


app.get("/home.ejs", (reqs, resp)=>{
const data = {
};
resp.render('home', {data});
})

app.get("/login.html", (req, res)=>{
    res.sendFile(__dirname + "/Pages/login.html")
})
app.get("/index.html", (req, res)=>{
    res.sendFile(__dirname + "/Pages/index.html")
})

// mostly will not need
app.get("/profile.ejs", async (req, res) => {
    try {
        res.render('profile', { data });
    } catch (error) {
        
        res.status(500).send("An error occurred while fetching user data. Please try again later.");
    }
});

app.get("/blood.ejs", (req, res)=>{
    res.render("blood", {data});
})

app.get("/recieve.ejs", (req, res)=>{

    const data = {
    }
    res.render('recieve', {data});
})
// page to show nearby map 
app.get("/map.ejs", (req, res)=>{
    res.render('map')
})

app.get("/bloodbank.html", (req, res)=>{
    res.sendFile(__dirname + "/Pages/bloodbank.html")
})

app.get("/banklogin.html", (req, res)=>{
    res.sendFile(__dirname + "/Pages/banklogin.html")
})

app.get("/profile-bloodbank.ejs", (req, res)=>{
    res.render("profile-bloodbank", {data})
})

//for sending mails
app.post('/send-email', async (req, res) => {
    try {
        const no = req.body.user;
        const Aplus = req.body.Aplus;
        const Aminus = req.body.Aminus;
        const Bplus = req.body.Bplus;
        const Bminus = req.body.Bminus;
        const ABplus = req.body.ABplus;
        const ABminus = req.body.ABminus;
        const Oplus = req.body.Oplus;
        const Ominus = req.body.Ominus;
        console.log(no);
        await askdb.filldata(no, Aplus, Bplus, ABplus, Oplus, Aminus, Bminus, ABminus, Ominus);

       
        let users = {};

        
        console.log(Aplus);
        
        var gba, gbb, gbab, gbo, gb0a, gb0b, gb0ab, gb0o;
        if(Aplus==0){
           var ans = await askdb.finddata('A+');
           gba = ans;
        //    console.log(gba);
        }
        if(Bplus===0){
            var ans = await askdb.finddata('B+');
            gbb = ans;
        }
        if(ABplus===0){
            var ans = await askdb.finddata('AB+');
            gbab = ans;
        }
        if(Oplus===0){
            var ans = await askdb.finddata('O+');
            gbo = ans;
        }
        if(Aminus===0){
            var ans = await askdb.finddata('A-');
            gb0a = ans;
        }
        if(Bminus===0){
            var ans = await askdb.finddata('B-');
            gb0b = ans;
        }
        if(ABminus===0){
            var ans = await askdb.finddata('AB-');
            gb0ab = ans;
        }
        if(Ominus===0){
            var ans = await askdb.finddata('O-');
            gb0o = ans;
        }
        // console.log(gba)
        var results ={...gba, ...gbb, ...gbab, ...gbo, ...gb0a, ...gb0b, ...gb0ab, ...gb0o}
        console.log(results)
        
        var user = {};
        for (const key in results) {
            if (Object.hasOwnProperty.call(results, key)) {
            user[`user${key}`] = results[key].phno;
            }
        }

        console.log(user);


        // Send emails to users
        for (var usera of Object.values(user)) {
            console.log(usera);
            try{
                await sendsms(usera);
            }catch(error){
                console.log(error);
            }
        }
        res.send('messages sent successfully');

    } catch (error) {
        console.error('Error sending messages:', error);
        res.status(500).send('Messages not sent successfully');
    }
});

app.post("/blood", (req, res)=>{
    var data = 0;
    res.render("blood", data);
})

// Lpogin or sign up page
//error free    
app.post('/index.html', async (req, res) => {
    try {
        const username = req.body.username;
        const phno = req.body.number;
        const dob = req.body.dob;
        const mail = req.body.mail;
        const password = req.body.Password;
        const pwwd = req.body.confirm;
        const gender = req.body.gender;
        const u_add = req.body.address;
        const u_adhaar = req.body.adhaar;
        const bldgrp = req.body.bgrp;
        if(pwwd===password){
            await askdb.insertsignup(username, phno, dob, password, mail, gender, u_add, u_adhaar, bldgrp);

            
            const data = {
                Name: username,
                age: agefinder(dob),
                gender: gender,
                bloodgroup:bldgrp,
                Phone: phno,
                mail: mail,
                address: u_add
            };
            try{
                res.render("profile", {data});
            }catch(error){
                res.sendFile(__dirname + "/Pages/index.html")
            }
        }else{
            res.send("re-enter password")
        }
    } catch (error) {
        console.error("Error occurred during user registration:", error);
        
        if (error.code === '23505') {
            res.render("profile", {data});
        } else {
            res.status(500).send("An error occurred during user registration. Please try again later.");
        }
    }
});


// profile page image subission
app.post('/profile.ejs', 
    (req, res)=>{
        var propic = req.body.prof_pic;
})

// ERROR FREE
app.post('/login.html', async (req, res) => {
    try {
        const username = req.body.username;
        const dob = req.body.dob;
        const password = req.body.password;
        const userExists = await askdb.checkusername(username);
        const passkey = await askdb.getuserdata(username).passkey;
        const date = await askdb.getuserdata(username).dob;
        const file = await askdb.getuserdata(username);
        const data = {
            Name:username,
            mail:file.mail,
            age:agefinder(file.dob),
            Phone: file.phno,
            gender:file.gender,
            bloodgroup:file.bloodgroup,
            address:file.add
        }
        if (userExists ) {
            res.render("profile", {data});
        } else {
            res.status(404).send("No such data found or wrong password");
        }
    } catch (error) {
        console.error("Error occurred during login:", error);
        res.status(500).send("An error occurred during login. Please try again later.");
    }
});
var no;
app.post('/bloodbank.html', (req, res) => {
    try {
        const name = req.body.name;
        const Umail = req.body.mail;
        const reNumber = req.body.regNumber;
        const pwd = req.body.pwd;
        const cpwd = req.body.cpwd;
        no = reNumber;
        if (pwd===cpwd) {
            askdb.insertbank(name, Umail, reNumber, pwd, cpwd);
            const data = {
                name: name,
                mail: Umail,
                RegNum: reNumber
            }
            res.render("profile-bloodbank", { data });
        } else {
            res.send("Password didn't match. Try again.");
        }
    } catch (error) {
        res.send("An error occurred! Try again");
    }
});

app.post('/bloodlogin.html', async(req, res)=>{
    try {
        const reNumber = req.body.regNumber;
        const pwd = req.body.pwd;
        no = reNumber;
        const value = await askdb.discodata(reNumber);
        console.log(value);
        if (value.number===reNumber && pwd === value.pwd) {
            const data = {
                name: value.name,
                mail: value.mail,
                RegNum: reNumber
            }
            res.render("profile-bloodbank", { data });
        } else {
            res.send("Password didn't match. Try again.");
        }
    } catch (error) {
        res.send("An error occurred! Try again");
    }
});


// home page: post method
// error free 
app.post('/home.ejs', async (req, res) => {
    try {
        
        const if_blood_donated = req.body.Donateblood;
        const donated_date = req.body.donatdate;
        const chronic = req.body.ChronicDis;
        const medication = req.body.medicals;
        const surgery = req.body.surgery;
        const illness = req.body.symptom;
        const infectious_travel = req.body.maleri;
        const trans_dis = req.body.transmisdis;
        const addiction = req.body.riskybehave;
        const tattoo = req.body.tattoo;
        const consent = req.body.consent;

        
        // Insert donation data into the database
        await askdb.insertdonate(req.body.name, if_blood_donated, donated_date, chronic, medication, surgery, illness, infectious_travel, trans_dis, addiction, tattoo, consent);
        
        res.redirect('/map.ejs'); 
    } catch (error) {
        console.error('Error occurred:', error);
        res.sendStatus(500); 
    }
});

app.post('/action1', (req, res)=>{
    res.redirect("/home.ejs")
})
app.post('/action2', (req,res)=>{
    res.redirect('/recieve.ejs');
})


//error free just tointegreate api
app.post('/recieve.ejs', async (req, res)=>{
    try{
    const user = req.body.name;
    const bloodgrp = req.body.bgrp;
    const bloodtype = req.body.btype;
    const advtrans = req.body.AdverseTransfusion
    const medicHist = req.body.medical;
    const cons = req.body.consentcheck;
    console.log(req.body);
    await askdb.insertrecieve(user,bloodgrp, bloodtype, advtrans,medicHist,cons);
    res.redirect('/map.ejs')
    } catch(error){
        console.error('Error occurred:', error);
        res.sendStatus(500);
    }
})


app.listen(3000, ()=>{
    console.log("Server started at 3000")
})
