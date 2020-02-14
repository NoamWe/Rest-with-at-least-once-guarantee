
const dataCache = require('./dataCach')
const tasksCache = require('./tasksCach')
const express = require('express')
const app = express()
const port = 3000

dataCache.init();
tasksCache.init();
// dataCache.insert('noam')
// dataCache.selectAll();

// tasks.insert('test')

tasksCache.selectAll().then(tasks => {

    console.log(tasks)
    //if we have leftover tasks

    if(Array.isArray && tasks.length !==0){
        console.log('leftover tasks')
    }
    app.get('/:name', (req, res) => {

        const name = req.params.name
        dataCache.insert(name)
            .then((dataId) => {
                return tasksCache.insert(dataId)
            })
            .then((taskId) => {
                //make api call
                tasksCache.delete(taskId)
                //then delete from cache
            })
            .finally(() => {

                console.log('tasks: \n' + tasksCache.selectAll())
                console.log('data' + dataCache.selectAll())
            })
        console.log('hello ')
    })

    app.listen(port, () => console.log(`Example app listening on port ${port}!`))

})
    .catch(e => {
        console.log(e)
    })

