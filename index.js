const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  fs.readdir("./hisaab", (err, files) => {
    if (err) return res.status(500).send(err);
    res.render("index", { files: files });
  });
});

app.get("/create", (req, res) => {
  res.render("create");
});

app.post("/createhissab", (req, res) => {
  // Create a new Date object
  const today = new Date();

  // Get the day, month, and year
  let day = today.getDate();
  let month = today.getMonth() + 1; // Months are zero-indexed
  const year = today.getFullYear();

  // Add leading zeros to day and month if they are less than 10
  if (day < 10) {
    day = '0' + day;
  }

  if (month < 10) {
    month = '0' + month;
  }

  // Format the date as dd-mm-yyyy
  const formattedDate = `${day}-${month}-${year}`;
  

  fs.writeFile(`./hisaab/${formattedDate}.txt`, req.body.content, (err) => {
    if (err) return res.status(500).send(err);
    res.redirect("/");
  });
});

app.get("/edit/:filename", (req, res) => {
  fs.readFile(`./hisaab/${req.params.filename}`, "utf-8", (err, filedata) => {
    if (err) return res.status(500).send(err);
    res.render("edit", { filedata, filename: req.params.filename });
  });
});

app.post("/update/:filename", (req, res) => {
  fs.writeFile(`./hisaab/${req.params.filename}`, req.body.content, (err) => {
    if (err) return res.status(500).send(err);
    res.redirect("/");
  });
});

app.get("/hisaab/:filename", (req, res) => {
  fs.readFile(`./hisaab/${req.params.filename}`, "utf-8", (err, filedata) => {
    if (err) return res.status(500).send(err);
    res.render("hisaab", { filedata,filename:req.params.filename });
  });
});
app.get("/delete/:filename",(req,res)=>{
  fs.unlink(`./hisaab/${req.params.filename}`,(err)=>{
    if(err) return res.status(500).send(err);
    res.redirect("/");
  })
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
