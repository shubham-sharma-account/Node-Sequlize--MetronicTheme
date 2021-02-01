const { User } = require('../users/user-model');
const fs = require('fs');
const csv = require('fast-csv');

class CSV {
    //export csv of database
    async exportCSV() {
        try {
            await User.findAll().then(async (objs) => {
                let tutorials = [];
    
                objs.forEach((obj) => {
                    const { id, name, email, phone, status, createdAt } = obj;
                    tutorials.push({ id, name, email, phone, status, createdAt });
                });
                const ws = await fs.createWriteStream("export.csv");
                await csv
                    .write(tutorials, { headers: true })
                    .on("finish", function () {
                        console.log("Write to export.csv successfully!");
                    })
                    .pipe(ws);
            });
        } catch (error) {
            console.log(error);
        }
    }

    //import csv into database
    async importCSV(req,res,next) {
        try {
            let tutorials = [];
            let path = '/home/shubham/Desktop/Metro_theme_firebase/import.csv';

            fs.createReadStream(path)
                .pipe(csv.parse({ headers: true }))
                .on("error", (error) => {
                    throw error;
                })
                .on("data", (row) => {
                    tutorials.push(row);
                })
                .on("end", async () => {
                    await User.bulkCreate(tutorials)
                        .then(() => {
                            next();
                        })
                        .catch((error) => {
                            res.status(501).send(`Fail to import data into database!`);
                        });
                });
        } catch (error) {
            res.status(500).send(`Could not upload the file`);
        }
    }
}

module.exports = CSV;