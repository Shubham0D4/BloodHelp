const db = require('../../database');

async function checkusername(username) {
    try {
        const result = await db.query("SELECT EXISTS (SELECT 1 FROM users WHERE username = $1) AS entity_present;", [username]);
        console.log(result.rows[0].entity_present);
        return result.rows[0].entity_present;
    } catch (error) {
        console.error("Error occurred while checking username:", error);
        return false;
    }
}

// error free
async function insertsignup(user, phno, dob, pass, mail, gender, address, adhaar, bldgrp){
    try {
        await db.query("INSERT INTO users (username, phno, dob, passkey, mail, gender, add, adhaar, bloodgroup) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);", [user, '+91'+phno, dob, pass, mail, gender, address, adhaar, bldgrp]);
        console.log("Sign up successful");
    } catch (error) {
        throw error;
    }
}
//error free
async function getuserdata(username) {
    try {
        const result = await db.query("SELECT * FROM users WHERE username = $1;", [username]);
        console.log("User data retrieved:", (result.rows[0])); // Add logging to check retrieved data
        return result.rows[0];
    } catch (error) {
        console.error("Error occurred while fetching user data:", error);
        throw error;
    }
}

//error free
async function insertdonate(user, a, b, c, d, e, f, g, h, i, j, k, l){
    try {
        await db.query("UPDATE users SET full_name = $1, if_donated = $2, DOD = $3, chronic_dis = $4, medication = $5, surgery = $6, symptoms = $7, travel = $8, trans_dis = $9, addiction = $10, tattoo = $11, consent_r  = $12 WHERE username = $13;", [a, b, c, d, e, f, g, h, i, j, k, l, user]);
        console.log("Successfully submitted");
    } catch (error) {
        throw error;
    }
}

//error free
async function insertrecieve(user, a, b, c, d, e){
    try {
        await db.query("UPDATE users SET bloodgroup = $1, bloodtype = $2, adv_trans = $3, medic_hist = $4, consent_rec = $5 WHERE username = $6;", [a, b, c, d, e, user]);
        console.log("Successfully submitted");
    } catch (error) {
        throw error;
    }
}


// for bloood banks

async function getnumber(bldgrp){
    try{
        const numb = db.query("select phno from users where bloodgroup = $1" [bldgrp])

        const reqmail = numb.rows.map(row => ({
            numb: row.phno
        }))
        return reqmail;
    } catch(error){
        console.log("errror while sending mesage.")
    }
}

async function insertbank(name, mail, number, pwd, cpwd){
    try {
        const query = 'INSERT INTO blood_banks (name, mail, number, pwd, cpwd) VALUES ($1, $2, $3, $4, $5)';
        await db.query(query, [name, mail, number, pwd, cpwd]);
        
        
      } catch (error) {
        console.error('Error inserting data:', error);
        
      }
}
async function finddata(number){
    try {
        const result = await db.query("SELECT phno FROM users WHERE bloodgroup = $1;", [number]);
        console.log("User data retrieved:", (result.rows));
        return result.rows;
    } catch (error) {
        console.error("Error occurred while fetching user data:", error);
        throw error;
    }
}

async function discodata(number){
    try {
        const result = await db.query("SELECT * FROM blood_banks WHERE number = $1;", [number]);
        console.log("User data retrieved:", (result.rows));
        return result.rows;
    } catch (error) {
        console.error("Error occurred while fetching user data:", error);
        throw error;
    }
}

async function filldata(no, a,b,c,d,e,f,g,h){
    try{
        await db.query("UPDATE blood_banks SET bloodgroup_A = $2, bloodgroup_B = $3, bloodgroup_AB = $4, bloodgroup_O = $5, bloodgroup_negA = $6, bloodgroup_negB = $7, bloodgroup_negAB = $8, bloodgroup_negO = $9 WHERE number = $1;", [no, a,b,c,d,e,f,g,h]);
    } catch(error){
        console.log("Error occured while inserting data");
    }
}

// for mapping map
async function getLocation(){
    try{
        const result = await db.query("SELECT name, lat, long FROM location");
    
        const locationData = result.rows.map(row => ({
          name: row.name,
          lat: row.lat,
          long: row.long
        }));
    
        return locationData;
    } catch(error){
        console.log(error);
    }
}




module.exports = {
    checkusername, 
    insertsignup,
    getuserdata,
    insertdonate,
    insertrecieve,
    getLocation,
    getnumber,
    insertbank,
    finddata, 
    filldata,
    discodata
};



