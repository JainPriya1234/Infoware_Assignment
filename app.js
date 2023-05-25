const express= require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2');
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

//creating connnection with my local mysqlworkbench
const mysqlconnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'node',
    password: 'Priya@2002',
    multipleStatements:true
});

//insert an employee
app.post  ('/insert',async(req,res)=>{
    try{
        const {
            EmpName,JobTitle,Email,Address,City,State,
            contactType , ContactName , Relation , PhoneNumber
        }=req.body;
        Saveemployee = () =>{
            return new Promise((resolve, reject)=>{
                mysqlconnection.query('insert into employee values (?,?,?,?,?,?,?)',[empid,EmpName,JobTitle,Email,Address,City,State],  (error, elements)=>{
                    if(error){
                        return reject(error);
                    }
                    return resolve(elements);
                });
            });
        };
        Savecontact = () =>{
            return new Promise((resolve, reject)=>{
                mysqlconnection.query('insert into contact values (?,?,?,?,?)',[empid++,contactType,ContactName,Relation,PhoneNumber],  (error, elements)=>{
                    if(error){
                        return reject(error);
                    }
                    return resolve(elements);
                });
            });
        };
       const result =  await Saveemployee();
        await Savecontact();
        res.json("inserted ! ");
        }
    catch(err){
        res.json(err);
    }
}); 

//get all employees
app.get('/getall',(req,res)=>{
    try{
        mysqlconnection.query('select * from employee',(err,rows,fields)=>{
            if(!err){
                console.log(rows);
                res.json(rows);
            }
            else{
                console.log(err);
            }
        })
        
    }catch(err){
        console.log(err);
    }
}); 
var empid=1;

//get employee by id
app.get('/:id',(req,res)=>{   
    try{
        const fetchid = req.params.id;
        mysqlconnection.query('select * from employee WHERE empid= ?',fetchid,(err,rows)=>{
            if(!err){
                if(rows.length ==0){
                    res.json("id not present ! ");
                }
                else
             {   console.log(rows);
                res.json(rows);}
            }
            else{
                console.log(err);
            }
        })
    }catch(err){
        console.log(err);
    }
});    

//delete employee by id
app.delete('/delete/:empid',(req,res)=>{
    try{
        const empid = req.params.empid;
        console.log(empid);
        mysqlconnection.query('DELETE FROM employee WHERE empid=?',empid,(err,rows)=>{
            if(!err){
                
                res.json("Deleted sucessfully !");
            }
            else{
                console.log(err);
            }
        })
    }catch(err){
        console.log(err);
    }
}); 


//update
app.put  ('/update/:id',(req,res)=>{
    try{
        const empid = req.body.empid;
        const EmpName= req.body.EmpName;
        const JobTitle= req.body.JobTitle;
        const Email= req.body.Email;
        const Address= req.body.Address;
        const City= req.body.City;
        const State= req.body.State;
        
        mysqlconnection.query('UPDATE employee \
         SET EmpName=? ,JobTitle =? ,Email=? ,Address=? ,City=? , \
         State=? WHERE empid=?',[EmpName , JobTitle, Email , Address , City , State , empid],(err,result )=>{
            if(!err){
                res.json("updated successfully ! ");
            }
            else{ 
                res.json(err);
            }
        })
    }catch(err){
        console.log(err);
    }
});    

//connection with database
mysqlconnection.connect((err)=>{
    try{
        if(err){
            console.log("Connection Failed ! \n Error= "+ JSON.stringify(err));
        }
        else{
            console.log("Database Connected ! ");
        }
    }  
    catch(err)
    {
        console.log(err);
    }
}
);
app.listen(3000);
console.log("App is running at http://localhost:%d ",3000);
