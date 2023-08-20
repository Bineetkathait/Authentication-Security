import 'dotenv/config'; 
import  express  from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption"

const app=express();

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://127.0.0.1/userDB")
.then(() => console.log('Connected! to local database'));


const userSchema=new mongoose.Schema({
    email:String,
    password:String
});


console.log(process.env.API_KEY);
userSchema.plugin(encrypt,{secret:process.env.SCERET,encryptedFields:["password"]});

const user=new mongoose.model("User",userSchema);

app.get("/",async(req,res)=>{
    res.render("home.ejs");
});

app.get("/login",async(req,res)=>{
    res.render("login.ejs");
});

app.get("/register",async(req,res)=>{
    res.render("register.ejs");
});

app.post("/register",async(req,res)=>{

    const newUser=new user({
        email:req.body.username,
        password:req.body.password
    });
    newUser.save();
    res.redirect("/");
});

app.post("/login",async(req,res)=>{
    const userEmail=req.body.username;
    const userPassword=req.body.password;

    user.findOne({email:userEmail}).then((data)=>{
       if(data!=null){
        if(data.password===userPassword){
            res.render("secrets.ejs");
        }
       }else{
        console.log("username is not correct");
       }
        
    });
});

app.listen(3000,()=>{
    console.log("Listening on port 3000");
});