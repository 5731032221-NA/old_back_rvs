const express = require("express");
const router = express.Router();
const getConnection = require("typeorm");
const cors = require("cors");
const puppeteer = require('puppeteer')

let data22 = require("../../csv.json");
const { el } = require("date-fns/locale");
var XLSX = require('xlsx');
const multer  = require('multer');
var path = require("path");
var pdf = require("html-pdf");
fs = require("fs");

var resp = {
  status: "0000",
  msg: "Access Denied",
  content: [],
};

router.use(
  cors({
    origin: "*",
  })
);



router.get("/reports", async (req, res, next) => {
  try {
    resp.content = [];
    const connection = getConnection.createQueryBuilder();
    const responseReport = await connection.from(`report`).getRawMany();
    console.log("responseReport", responseReport);
    resp.content = responseReport;
    resp.status = "2000";
    resp.msg = "Success";
    res.send(resp);
  } catch (error) {
    resp.status = "1000";
    resp.msg = "Failure";
    resp.content = [];
    console.log(error);
    res.send(resp);
  }
});

// router.post("/reports", async (req, res, next) => {
//   try {
//     const connectDuplicate = getConnection.createQueryBuilder();
//     const itemsAleady = await connectDuplicate
//       .select(`reportid`)
//       .from(`report`)
//       .where(`reportid = '${req.body.reportid}'`)
//       .getRawOne();

//     if (!itemsAleady) {
//       const connection = getConnection.createQueryBuilder();
//       const insertdata = await connection
//         .insert()
//         .into(`report`)
//         .values(req.body)
//         .returning("*")
//         .updateEntity(false)
//         .execute();
//       resp.content.push(insertdata.raw);

//       resp.status = "2000";
//       resp.msg = "Success";
//     } else {
//       resp.status = "1000";
//       resp.msg = `Duplicate`;
//       resp.content = [];
//     }

//     res.send(resp);
//   } catch (error) {
//     console.log("err users", error);
//     resp.msg = "Failer";
//     res.send(resp);
//   }
// });

router.put("/reports/:id", async (req, res, next) => {
  let id = req.params.id;
  try {
    resp.content = [];
    const connection = getConnection.createQueryBuilder();
    const update = await connection
      .update("report", req.body)
      .set({ reportjson: req.body })
      .where("reportid  = :id", {
        id,
      })
      .updateEntity(true)
      .returning("*")
      .execute();

    console.log("update", update);
    console.log("update", update.affected);
    if (update.affected !== 0) {
      resp.content.push(update.raw[0]);
      resp.status = "2000";
      resp.msg = "Success";
    } else {
      resp.content = [];
      resp.status = "1000";
      resp.msg = "Access Denied";
    }
    res.send(resp);
  } catch (error) {
    console.log(error);
    res.send(resp);
  }
});

// router.delete("/reports/:id", async (req, res, next) => {
//   resp.content = [];
//   try {
//     let id = req.params.id;
//     const connection = getConnection.createQueryBuilder();
//     const drop = await connection
//       .delete()
//       .from("report")
//       .where("id  = :id", {
//         id,
//       })
//       .returning("*")
//       .execute();

//     if (drop.affected !== 0) {
//       resp.content.push(drop.raw);
//       resp.status = "2000";
//       resp.msg = "Success";
//     } else {
//       resp.status = "1000";
//       resp.msg = `Failure Delete`;
//       resp.content = [];
//     }
//     res.send(resp);
//   } catch (error) {
//     console.log(error);
//     res.send(resp);
//   }
// });

function makename(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}



router.post("/reports/pdf", async (req, res, next) => {
 
  try {
  const namerepdf = await  createPDF(req.body.content[0].reportjson,req.body.content[0].config)
   res.json({name: namerepdf})
   
  } catch (error) {
    console.log(error);
    res.send(resp);
  }
});


router.post("/reports/excel", async (req, res, next) => {
 
  try {
  const namerepdf = await  createExcel(req.body.content[0].reportjson)
   const name = makename(25)
   let workBook = XLSX.utils.book_new();
  const workSheet = XLSX.utils.json_to_sheet(namerepdf);
  XLSX.utils.book_append_sheet(workBook, workSheet, `response`);
  let exportFileName = `public/uploads/${name}.xlsx`;
  XLSX.writeFile(workBook, exportFileName);
  res.json({name: name})
   
  } catch (error) {
    console.log(error);
    res.send(resp);
  }
});




//read xlsx
var workbook = XLSX.readFile(path.resolve("./public/uploads") +'/Lab.xlsx');
var readxlsx = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
// end read xlsx


// write xlsx
const json = [
  {
      id: 1,
      color: 'red',
      number: 75
  },
  {
      id: 2,
      color: 'blue',
      number: 62
  },
  {
      id: 3,
      color: 'yellow',
      number: 93
  },
];

let workBook = XLSX.utils.book_new();
const workSheet = XLSX.utils.json_to_sheet(json);
XLSX.utils.book_append_sheet(workBook, workSheet, `response`);
let exportFileName = `public/uploads/response4.xlsx`;
XLSX.writeFile(workBook, exportFileName);
// end write xlsx


//upload xlsx
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads');
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
  }
});
var upload = multer({ //multer settings
  storage: storage
});

function validate(req, res, next) {
  if (!req.file) {
    return res.send({
      errors: {
        message: 'file cant be empty'
      }
    });
  }
  next();
}

router.post('/report', upload.single('file'), validate, function (req, res) {
  const fileLocation = req.file.path;
 // console.log(fileLocation); // logs uploads/file-1541675389394.xls
  var workbook2 = XLSX.readFile(fileLocation);
  var sheet_name_list2 = workbook2.SheetNames;
  return res.json({
    json: XLSX.utils.sheet_to_json(workbook2.Sheets[sheet_name_list2[0]])
  });
});
//end upload xlsx


//download pdf
router.get('/reports/download_pdf', function (req, res) {

  const fileName = req.query.name;
  console.log("fileName:",fileName);
  res.download('./public/uploads/'+ fileName +'.pdf')

//  res.download('./public/uploads/'+ fileName +'.pdf', fileName, (err) => {
//    if (err) {
//      res.status(500).send({
//        message: "Could not download the file. " + err,
//      });
//    }
//  });
       
});

//end download pdf


//download pdf
router.get('/reports/download_excel', function (req, res) {

  const fileName = req.query.name;
  res.download('./public/uploads/'+ fileName +'.xlsx')

//  res.download('./public/uploads/'+ fileName +'.pdf', fileName, (err) => {
//    if (err) {
//      res.status(500).send({
//        message: "Could not download the file. " + err,
//      });
//    }
//  });
       
});

//end download pdf






//config report and data
const reportCongf = {
  rptName: "Chatchawarn Family",
  version: 1,
  createdDate: "2021-12-08T00:00:00.000Z",
  modifiedDate: "2021-12-08T00:00:00.000Z",
  production: true,
  defaultTitle: {
    title1: "12345",
    title2: "John Doe",
  },
  filters: {
    p1: {
      par: "rptDate",
      type: "Range",
      inputFormat: "dd/mm/yy hh:mm",
    },
  },
  Columns: [
    {
      ColTitle: "Property Name",
      rptData: "Property_desc",
      sum: 0,
      StatusSum: false,
    },
    {
      ColTitle: "Code",
      rptData: "Property",
      sum: 0,
      StatusSum: false,
    },
    {
      ColTitle: "Managed Type",
      rptData: "Property_Type",
      sum: 0,
      StatusSum: false,
    },
    {
      ColTitle: "Status",
      rptData: "Status",
      SubGroup: {
        level: "1",
        subDesc: "$",
        pageBreak: "Y",
        ColSum: ["No_of_Room"],
      },
      sum: 0,
      StatusSum: false,
    },
    {
      ColTitle: "#Rooms",
      rptData: "No_of_Room",
      rptTotal: "SUM",
      sum: 0,
      StatusSum: false,
      ColAlign: "right",
    },
    {
      ColTitle: "Category",
      rptData: "Hotel_Categories",
      sum: 0,
      StatusSum: false,
    },
    {
      ColTitle: "Country",
      rptData: "Country",
      SubGroup: {
        level: "2",
        subDesc: "$",
        ColSum: ["No_of_Room"],
      },
      sum: 0,
      StatusSum: false,
    },
    {
      ColTitle: "Zone",
      rptData: "Zone_Chr",
      SubGroup: {
        level: "3",
        subDesc: "$",
        ColSum: ["No_of_Room"],
      },

      sum: "Sum",
      StatusSum: false,
    },
  ],
  total: {
    TotalDesc: "Grand Total",
  },
  footer: "Y",
};

const config = [
  {
    ColTitle: "Status",
    rptData: "Status",
    SubGroup: {
      level: "1",
      ColSum: ["Amount", "Qty", "Total Amount", "Add Amount"],
    },
  },
  {
    ColTitle: "Zone",
    rptData: "Zone",
    SubGroup: {
      level: "3",
      ColSum: ["Amount", "Qty", "Total Amount", "Add Amount"],
    },
  },
  {
    ColTitle: "Country",
    rptData: "Country",
    SubGroup: {
      level: "2",
      ColSum: ["Amount", "Qty", "Total Amount", "Add Amount"],
    },
  },
  {
    ColTitle: "Amount",
    rptData: "Amount",
    ColFormat: 2,
    ColAlign: "right",
  },
  {
    ColTitle: "Qty",
    rptData: "Status",
  },
  {
    ColTitle: "Total Amount",
    rptData: "Amount*Qty",
    DataCal: ["Amount", "Qty"],
    ColFormat: 2,
    ColAlign: "right",
  },
  {
    ColTitle: "Add Amount",
    rptData: "Amount+Qty",
    DataCal: ["Amount", "Qty"],
    ColFormat: 0,
    ColAlign: "right",
  },
];

const data = [
  {
    Status: "O",
    Zone: "BKK",
    Country: "Thailand",
    Amount: 100,
    Qty: 2,
    Property: "A",
  },
  {
    Status: "O",
    Zone: "Nonthaburi",
    Country: "Thailand",
    Amount: 1000,
    Qty: 2,
    Property: "C",
  },
  {
    Status: "O",
    Zone: "BKK",
    Country: "Thailand",
    Amount: 50,
    Qty: 2,
    Property: "B",
  },
  {
    Status: "O",
    Zone: "Oman",
    Country: "Oman",
    Amount: 5.02,
    Qty: 2,
    Property: "D",
  },
  {
    Status: "C",
    Zone: "BKK2",
    Country: "Thailand",
    Amount: 99,
    Qty: 2,
    Property: "E",
  },
  {
    Status: "D",
    Zone: "BKK2",
    Country: "Thailand",
    Amount: 599,
    Qty: 82,
    Property: "E",
  },
  {
    Status: "D",
    Zone: "BKK2",
    Country: "Thailand",
    Amount: 599,
    Qty: 82,
    Property: "S",
  },
];
//column กับ data ต้อง เท่ากัน
const configBike = {
  rptName: "Chatchawarn Family",
  version: 1,
  createdDate: "2021-12-08T00:00:00.000Z",
  modifiedDate: "2021-12-08T00:00:00.000Z",
  production: true,
  defaultTitle: {
    title1: "12345",
    title2: "John Doe",
  },
  Columns: [
    {
      ColTitle: "SubCategory",
      rptData: "Cat2",
      SubGroup: {
        level: "2",
        subDesc: "$",
        SubPageBreak: "N",
      },
    },
    {
      ColTitle: "Product Name",
      rptData: "ProductDesc",
    },
    {
      ColTitle: "Sales Amount",
      rptData: "Amount",
      ColFormat: 2,
      ColAlign: "right",
      rptTotal: "SUM",
    },
    ,
    {
      ColTitle: "OverlapCategory",
      rptData: "Cat3",
      SubGroup: {
        level: "3",
        subDesc: "$",
        SubPageBreak: "N",
      },
    },
    {
      ColTitle: "Category",
      rptData: "Cat1",
   
      SubGroup: {
        level: "1",
        subDesc: "$",
        SubPageBreak: "Y",
      },
    },
    {
      ColTitle: "Freight",
      rptData: "freightAmt",
      ColFormat: 2,
      ColAlign: "right",
      rptTotal: "SUM",
    },
    {
      ColTitle: "Tax Amount",
      rptData: "Amount*7/100",
      DataCal: ["Amount"],
      ColFormat: 2,
      ColAlign: "right",
      rptTotal: "SUM",
    },
    {
      ColTitle: "Extended Amount",
      rptData: "(Amount*7/100)+freightAmt",
      DataCal: ["Amount", "freightAmt"],
      ColFormat: 2,
      ColAlign: "right",
      rptTotal: "AVG",
    },
  ],
};

//column กับ data ต้อง เท่ากัน
const dataBike = [
  {
    Cat1: "cat 1",
    Cat2: "sub cat 1",
    Cat3: "sub cat 3",
    ProductDesc: "productdesc",
    Amount: 300,
    freightAmt: 252.32,
    
  },
  {
    Cat1: "cat 2",
    Cat2: "sub cat 2",
    Cat3: "sub cat 3",
    ProductDesc: "productdesc",
    Amount: 200,
    freightAmt: 25.3,
    
  },
  {
    Cat1: "cat 2",
    Cat2: "sub cat 2",
    Cat3: "sub cat 3",
    ProductDesc: "productdesc",
    Amount: 100,
    freightAmt: 25.3,
    
  },
  {
    Cat1: "cat 2",
    Cat2: "sub cat 2",
    Cat3: "sub cat 3",
    ProductDesc: "productdesc555",
    Amount: 300,
    freightAmt: 25.3,
    
  },
  {
    Cat1: "cat 2",
    Cat2: "sub cat 2",
    Cat3: "sub cat 3",
    ProductDesc: "productdesc555",
    Amount: 500,
    freightAmt: 25.3,
    
  },
  {
    Cat1: "cat 2",
    Cat2: "sub cat 3",
    Cat3: "sub cat 3",
    ProductDesc: "productdesc555",
    Amount: 600,
    freightAmt: 25.3,
    
  },
];

//column กับ data ต้อง เท่ากัน ProfileIndividual
const configProfileIndividual = {
  rptName: "Profile Individual",
  version: 1,
  createdDate: "2021-12-08T00:00:00.000Z",
  modifiedDate: "2021-12-08T00:00:00.000Z",
  production: true,
  defaultTitle: {
    title1: "12345",
    title2: "Profile Individual",
  },
  Columns: [
    {
      ColTitle: "ID",
      rptData: "nameid",
     
    },
    {
      ColTitle: "Title",
      rptData: "title",
    },
    {
      ColTitle: "First Name",
      rptData: "firstname",
     
    },
    ,
    {
      ColTitle: "Last Name",
      rptData: "lastname",
    
    },
    {
      ColTitle: "Gender",
      rptData: "gender",
   
     
    },
    {
      ColTitle: "Country",
      rptData: "countrycode",
      ColAlign: "right",
    
    },
    {
      ColTitle: "Last Stay",
      rptData: "laststay",
      ColAlign: "right",
    },
    {
      ColTitle: "Score",
      rptData: "score",
      ColAlign: "right",
     
    },
    {
      ColTitle: "Status",
      rptData: "status",
      ColAlign: "right",
     
    },
  ],
};

//column กับ data ต้อง เท่ากัน Profile Company

const configProfileCompany = {
  rptName: "Profile Company",
  version: 1,
  createdDate: "2021-12-08T00:00:00.000Z",
  modifiedDate: "2021-12-08T00:00:00.000Z",
  production: true,
  defaultTitle: {
    title1: "12345",
    title2: "Profile Company",
  },
  Columns: [
    {
      ColTitle: "Name",
      rptData: "name",
     
    },
    {
      ColTitle: "Abbreviation",
      rptData: "abbreviation",
    },
    {
      ColTitle: "WWW",
      rptData: "www",
     
    },
    ,
    {
      ColTitle: "City/Country",
      rptData: "citycountry",
    
    },
    {
      ColTitle: "Industry",
      rptData: "industrycode",
   
     
    },
    {
      ColTitle: "IATA",
      rptData: "iata",
      ColAlign: "right",
    
    },
  ],
};

// end config report and data



//report pdf


const createPDF = async (newReportsData,config) => {
  var rowdata = ``;
  var titletable = ``;
  var columnslist = ``;


  
  if (newReportsData) {
    const getTitleTable = [];
    const getTitleExport = [];
    let fw = 1;
    Object.values(newReportsData.titles).forEach((element) => {
      getTitleTable.push(element);
      // getTitleExport.push(element.title);

      if (fw == 1) {
        titletable += `<h3 style="font-weight: 600;">${element.title}</h3> `;
      } else if (fw == 2) {
        titletable += `<h3 style="font-weight: bold;">${element.title}</h3> `;
      } else {
        titletable += `<h3 style="font-weight:normal;">${element.title}</h3> `;
      }

      fw += 1;
    });

    Object.values(newReportsData.columns).forEach((element) => {
      columnslist += `<th style="border-bottom: 1.5px solid #673ab7;">${element.title}</th> `;
    });

    for (let i = 0; i < newReportsData.titles.length - 1; i++) {
      getTitleExport.push(newReportsData.titles[i].title);
    }

    let newListData = [];
    const newRowsTable = newReportsData.details;
    newListData.push(...listData(newRowsTable));
    // newListData.push(newReportsData.grand_total);
    newListData.push({
      ...{
        [newReportsData.grand_total.column]: newReportsData.grand_total.name,
      },
      ...newReportsData.grand_total.value,
    });

    var numcheck = 1;

    newListData.forEach((item) => {
  
      let setfw = 0;
     
      if (Object.keys(item).length < newReportsData.columns.length) {
        
        var groupList = config.Columns.filter((conf) =>
          conf.hasOwnProperty("SubGroup")
        );

      

       

        rowdata += `<tr style="border-top: 1.5px solid #284781; border-bottom: 1.5px solid #284781; "> `;
        setfw = "fwb";

        Object.values(newReportsData.columns).forEach((element) => {
        //  console.log("element:", element);
          if (item[element.field]) {
            rowdata += `<td class="${setfw}">${item[element.field]}</td> `;
          } else {
            rowdata += `<td> </td> `;
          }
        });
        rowdata += ` </tr> `;
        groupList.forEach((pagebreackitem) => {
          if (item[pagebreackitem.rptData]) {
            if (pagebreackitem.SubGroup.SubPageBreak == "Y") {
              if ((newListData.length - 1) > numcheck) {
               
		      rowdata += `
           
                <div> style="page-break-after: always;">&nbsp;</div>
               
              `;
                
               // rowdata += `<tr  style="text-align:center;">  <td colspan="${newListData.length}" > <div > ${ titletable }  </div> </td></tr> `;
               // rowdata +=  `<tr> ${columnslist}</tr>`
              }
              
            }
          }
        });
      } else {
        setfw = "fwn";
        rowdata += `<tr class="testnth">`;

        Object.values(newReportsData.columns).forEach((element) => {
         
          if (item[element.field]) {
            rowdata += `<td class="${setfw}">${item[element.field]}</td> `;
          } else {
            rowdata += `<td> </td> `;
          }
        });
        rowdata += ` </tr> `;
      }

      numcheck += 1;
    });

    // console.table(JSON.stringify(newListData));
  }



const html = `<!DOCTYPE html>
<html>
<head>
<style type="text/css">
table {
  border-collapse: collapse;
  width: 100%;
  
  
}



th {
  color: #5727b7;
  font-size:12px
}

th, td {
  text-align: left;
  padding: 8px;
  font-size:12px
  
}
h3 {
  text-align:center;
  font-size:12px
}
.fwn {
  font-weight:normal;
}
.fwb {
  font-weight:bold;
}
.testnth:nth-child(even) {background-color: #f6faff;}


</style>
</head>
<body>
<div style="overflow-x: auto;">
  <table>
  <thead >
   <tr> <th colspan="${config.Columns.length}"> <div style="color: #000">${titletable} </div> </th> </tr>
      <tr>
      ${columnslist}
      </tr>
	</thead>
  <tbody>
   ${rowdata}
   </tbody>
  </table>
</div>

</body>
</html>


`;

const option = {
  border: {
    top: "0.5in",
    right: "0.5in",
    left: "0.5in",
    bottom: "0in",
  },
  header: {
    height: "5mm",
    contents: {
      // first: 'Cover page',
      // 2: 'Second page', // Any page number is working. 1-based index
      default:
        '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
      //last: 'Last Page'
    },
  },
  // footer: {
  //   height:"15mm",
  //   "contents": "<div style='color: gray;border-top: 1px lightgray solid;font-size: 13px;padding-top: 10px'>MSC<a href='https://www.metrosystems.co.th'>REVOSOFT</a></div>"
  // },
  footer: {
    height: "20mm",
    contents: {
      // first: 'Cover page',
      // 2: 'Second page', // Any page number is working. 1-based index
      default:
        '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
      //last: 'Last Page'
    },
  },
};

const namerepdf = makename(25);
// await pdf.create(html, option).toStream(function (err, stream) {
//   stream.pipe(fs.createWriteStream(`./public/uploads/${namerepdf}.pdf`));
// });

//end report pdf


const browser = await puppeteer.launch({
  headless: true,
   args: ['--no-sandbox', '--disable-setuid-sandbox']
})
// create a new page
const page = await browser.newPage()
await page.setContent(html, {
  waitUntil: 'domcontentloaded'
})

// create a pdf buffer
const pdfBuffer = await page.pdf({
  format: 'A4'
})

// or a .pdf file
await page.pdf({
  format: 'A4',
  path: `./public/uploads/${namerepdf}.pdf`,
  margin: { top: 35, bottom: 30, right: 30, left: 30 },
  printBackground: true,
})

// close the browser
await browser.close()

return namerepdf


};


const createExcel = async (newReportsData) => {


  if (newReportsData) {
    const getTitleTable = [];
    const getTitleExport = [];
    
    Object.values(newReportsData.titles).forEach((element) => {
      getTitleTable.push(element);
      // getTitleExport.push(element.title);

    });


    for (let i = 0; i < newReportsData.titles.length - 1; i++) {
      getTitleExport.push(newReportsData.titles[i].title);
    }

    let newListData = [];
    const newRowsTable = newReportsData.details;
    newListData.push(...listData(newRowsTable));
    // newListData.push(newReportsData.grand_total);
    newListData.push({
      ...{
        [newReportsData.grand_total.column]: newReportsData.grand_total.name,
      },
      ...newReportsData.grand_total.value,
    });




    return newListData
  }






};

function listData(data) {
  let subDatas = [];
  // console.log(data)
  data.forEach((groupData) => {
    if (groupData.hasOwnProperty("detail")) {
      // console.log("data if", groupData, groupData.detail)
      groupData.detail.forEach((row) => {
        subDatas.push(row);
        // console.log("subDatas 2 ", subDatas)
      });
      // subDatas.push(groupData.total);
    } else {
      //console.log("groupData.total", groupData.total);
      subDatas.push(...listData(groupData.sub));
      subDatas.push({
        ...{ [groupData.total.column]: groupData.total.name + ":" },
        ...groupData.total.value,
      });
    }
  });
  // console.log("subDatas l ", subDatas)
  return subDatas;
}





//function report
function subGroups(data, groupList, level, config) {
  if (groupList.length == level) {
    data.forEach((row) => {
      config.forEach((item) => {
        // console.log(row,item.rptData,item.ColFormat)
        if (item.ColFormat && !item.DataCal) {
          row[item.rptData] = Number(row[item.rptData]).toFixed(item.ColFormat);
        }
      });

      // getTitleExport.push(element.title);
    });
    return [
      {
        // "total": data.reduce((sum, row) => sum + row.Amount, 0),
        detail: data,
      },
    ];
  } else {
    let subData = [];
    let subGroup = new Set();

    data.map((row) => subGroup.add(row[groupList[level].rptData]));
    subGroup.forEach((subName) => {
     // console.log("subName::",subName);
      const filterdData = data.filter(
        (row) => row[groupList[level].rptData] == subName
      );

      filterdData.forEach((data, inx) => {
        if (config.length > 0) {
          config.forEach((item) => {
            if (item.DataCal) {
              let asrptdata = item.rptData;
              item.DataCal.forEach((reitem) => {
                asrptdata = asrptdata.replace(reitem, filterdData[inx][reitem]);
              });
              filterdData[inx][item.ColTitle] = eval(asrptdata).toFixed(
                item.ColFormat
              );
            }
          });
        }
      });

      let subNext = subGroups(filterdData, groupList, level + 1, config);
      // console.log("filterdData:",filterdData.reduce((text , row) => text + row[groupList[level].rptData], ""));
      let sumdata = {};
      if (groupList[level].SubGroup.ColSum != undefined) {
        if (groupList[level].SubGroup.ColSum.length > 0) {
          groupList[level].SubGroup.ColSum.forEach((item) => {
            if (config.length > 0) {
              let formator = 0;
              config.forEach((ic) => {
                if (
                  ic.ColFormat != undefined &&
                  (ic.ColTitle == item || ic.rptData == item)
                ) {
                  formator = ic.ColFormat;
                }
              });
              sumdata[item] = filterdData
                .reduce(
                  (sum, row) =>
                    Number(sum) +
                    (isNaN(Number(row[item])) ? 0 : Number(row[item])),
                  0
                )
                .toFixed(formator);
            } else {
              sumdata[item] = filterdData.reduce(
                (sum, row) =>
                  Number(sum) +
                  (isNaN(Number(row[item])) ? 0 : Number(row[item])),
                0
              );
            }
          });
        }
      }

      if (groupList[level].SubGroup.ColCount != undefined) {
        if (groupList[level].SubGroup.ColCount.length > 0) {
          groupList[level].SubGroup.ColCount.forEach((item) => {
            sumdata[item] = filterdData.reduce(
              (sum, row) => Number(sum) + 1,
              0
            );
          });
        }
      }

      if (groupList[level].SubGroup.ColAvg != undefined) {
        if (groupList[level].SubGroup.ColAvg.length > 0) {
          groupList[level].SubGroup.ColAvg.forEach((item) => {
            let formator = 0;
            config.forEach((ic) => {
              if (
                ic.ColFormat != undefined &&
                (ic.ColTitle == item || ic.rptData == item)
              ) {
                formator = ic.ColFormat;
              }
            });

            let dataArray = [];
            filterdData.forEach((itemdata) => {
              if (itemdata[item]) {
                dataArray.push(itemdata[item]);
              }
            });
            sumdata[item] = (
              dataArray.reduce((p, c) => Number(p) + Number(c), 0) /
              dataArray.length
            ).toFixed(formator);
          });
        }
      }

    
      subData.push({
        total: {
          name: subName + " total",
          column: groupList[level].rptData,
          value: sumdata,
        },
        sub: subNext,
      });
    });
    return subData;
  }
}

const deepMergeSum = (obj1, obj2) => {
  return Object.keys(obj1).reduce((acc, key) => {
    if (typeof obj2[key] === "object") {
      acc[key] = deepMergeSum(obj1[key], obj2[key]);
    } else if (obj2.hasOwnProperty(key) && !isNaN(parseFloat(obj2[key]))) {
      acc[key] = Number(obj1[key]) + Number(obj2[key]);
    }
    return acc;
  }, {});
};

router.get("/report", async (req, res, next) => {
  try {
    resp.content = [];

    // set title
    let title = [];
    Object.keys(configBike.defaultTitle).forEach(function (key) {
      title.push({ title: configBike.defaultTitle[key] });
    });
    // const title = [
    //   { "title": configBike.defaultTitle.title1 },
    //   { "title": configBike.defaultTitle.title2 },
    //   { "title": configBike.createdDate },
    // ];

    // var groupList = config.filter(conf => conf.hasOwnProperty("SubGroup"));
    // var groupList = reportCongf.Columns.filter((conf) =>
    //   conf.hasOwnProperty("SubGroup")
    // );
    var groupList = configBike.Columns.filter(conf => conf.hasOwnProperty("SubGroup"));

    //console.log("filter group", groupList);
    groupList.sort(function (x, y) {
      return x.SubGroup.level - y.SubGroup.level;
    });
  //  console.log("sort by level", groupList);
    var setgroupList = [];
    groupList.forEach((item) => {
      item.SubGroup["ColSum"] = [];
      item.SubGroup["ColCount"] = [];
      item.SubGroup["ColAvg"] = [];
      //reportCongf.Columns.forEach((iconfig) => {
         configBike.Columns.forEach(iconfig => {

        if (iconfig.rptTotal) {
          if (iconfig.DataCal && iconfig.rptTotal == "SUM") {
            item.SubGroup["ColSum"].push(iconfig.ColTitle);
          } else if (iconfig.DataCal && iconfig.rptTotal == "COUNT") {
            item.SubGroup["ColCount"].push(iconfig.ColTitle);
          } else if (iconfig.DataCal && iconfig.rptTotal == "AVG") {
            item.SubGroup["ColAvg"].push(iconfig.ColTitle);
          } else {
            if (iconfig.rptTotal == "SUM") {
              item.SubGroup["ColSum"].push(iconfig.rptData);
            } else if (iconfig.rptTotal == "COUNT") {
              item.SubGroup["ColCount"].push(iconfig.rptData);
            } else if (iconfig.rptTotal == "AVG") {
              item.SubGroup["ColAvg"].push(iconfig.rptData);
            }
          }
        }
      });

      setgroupList.push(item);
    });

    var rows = [];

    

    // rows = subGroups(data, groupList, 0,config)
    //rows = subGroups(readxlsx, groupList, 0, reportCongf.Columns);
     rows = subGroups(dataBike, setgroupList, 0, configBike.Columns)
   //  console.log("rows",rows)

    let grand_total_value = [];
    for (const [key, value] of Object.entries(rows)) {
      grand_total_value.push(value.total.value);
    }

    const result = grand_total_value.reduce(
      (acc, obj) => (acc = deepMergeSum(acc, obj))
    );

    let totalValue = {};
    for (const key in result) {
      if (result.hasOwnProperty.call(result, key)) {
        let formator = 0;
         configBike.Columns.forEach(ic => {
       // reportCongf.Columns.forEach((ic) => {
          //config.forEach(ic => {
          if (
            ic.ColFormat != undefined &&
            (ic.HdrTitle == key || ic.rptData == key)
          ) {
            formator = ic.ColFormat;
          }
          totalValue[key] = result[key].toFixed(formator);
        });
      }
    }

    var setcolums = [];
    setcolums = setgroupList;
    configBike.Columns.filter(conf => !conf.hasOwnProperty("SubGroup")).forEach(item => {
      setcolums.push(item)
    });

    // reportCongf.Columns.filter(
    //   (conf) => !conf.hasOwnProperty("SubGroup")
    // ).forEach((item) => {
    //   setcolums.push(item);
    // });

    listColumns = [];

    setcolums.forEach((element) => {
      let align = {};
      if (element.ColAlign) align = { align: "right" };
      if (element.DataCal)
        listColumns.push({
          ...align,
          ...{ title: element.ColTitle, field: element.ColTitle },
        });
      else
        listColumns.push({
          ...align,
          ...{ title: element.ColTitle, field: element.rptData },
        });
    });

  //  console.log("listColumns:", listColumns);
    //reportCongf.Columns.forEach((item) => {
      configBike.Columns.forEach(item => {
      if (item.DataCal) {
     //   console.log(totalValue, item.ColTitle);
        if (item.ColFormat)
          totalValue[item.ColTitle] = parseFloat(
            totalValue[item.ColTitle]
          ).toFixed(item.ColFormat);
      }
    });

    //set data return
    const retu = {
      titles: title,
      columns: listColumns,
      details: rows,
      grand_total: {
        name: "Grand Total",
        column: setgroupList[0].rptData,
        value: totalValue,
      },
    };
    fs.writeFile("a.txt", JSON.stringify(retu), function (err, data) {
      if (err) {
        return console.log(err);
      }
      // console.log(data);
    });
    //  console.log(JSON.stringify(retu))

    resp.content.push(retu);
    resp.status = "2000";
    resp.msg = "Success";
    res.send(resp);
  } catch (error) {
    //console.log(error);
    res.send(resp);
  }
});
// end function report

module.exports = router;
