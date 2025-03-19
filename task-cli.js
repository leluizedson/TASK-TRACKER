#!/usr/bin/env node

const { Console } = require('console');
const { read, readFile } = require('fs');
const path = require('path');
const { dirname } = require('path');
const { json } = require('stream/consumers');
const task_file = path.join(__dirname, 'tasks.json')

let test = null
let taskID = null
let tasks = null
let listIDs = null

const fs = require('fs').promises;

async function readTask() {
    try {
        const dados = await fs.readFile(task_file, 'utf-8') 

        if (!dados.trim()){
            return []
        }
        const tasks = JSON.parse(dados)
        
        return tasks
    } catch (error) {
        if (error.code === 'ENOENT'){
            console.log('Arquivo inexistente. Criando arquivo...')
        
            const defaultData = JSON.stringify([], null, 2)

            await fs.writeFile(task_file, defaultData)
            console.log('Arquivo criado!')
            return []
        } else{
            console.log("Erro ao ler arquivo: ", error)
        }
    }
}

async function addTasks(task) {    
    try {
        tasks = await readTask()
        tasks.push(task)

        await fs.writeFile(task_file, JSON.stringify(tasks, null, 2))
        console.log('Tarefa registrada! ID da tarefa: ', task.id)
        
    } catch (error) {
        console.log("Erro ao adicionar tarefa:", error)
    }
}

async function updateTasks(tasks, taskID) {
    try {
        await fs.writeFile(task_file, JSON.stringify(tasks, null, 2))
        console.log(`Tarefa ID ${taskID} atualizada com sucesso!`)

    } catch (error) {
        console.log(`Erro ao atualizar tarefa ID ${taskID}:`, error)
    }
    
}

async function deleteTask(tasks, taskID) {
    try {
        await fs.writeFile(task_file, JSON.stringify(tasks, null, 2))
        console.log(`Tarefa de ID (${taskID}) deletada com sucesso!`)
    } catch (error) {
        console.log(`Erro ao deletar tarefa ID (${taskID})`, error)
    }
}

async function formatDate() {
    const date = new Date().toISOString()
    
    const formatDate = new Intl.DateTimeFormat('pt-BR', {
        day: "2-digit",
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(new Date(date))

    return formatDate

    
}
async function handleCommand() {
    const args = process.argv.slice(2) // process.args returns a array including both paths to NodeJs and the script being executed; the slice function here just remove those arguments

    if (args.length === 0){
        console.log('Forneça um comando')
        return
    }

    const command = args[0]

    switch (command) {
        case "add":
            const description = args[1]
            test = args[2]
            if (test){
                console.log('Comando invalido: description deve estar em aspas simples ou duplas')
                break
            } else if(!description){
                console.log('Comando incompleto: insira descrição da tarefa')
                break
            }

            let maxID = 0

            tasks = await readTask()

            for (let task of tasks) {
                if (task.id > maxID){
                    maxID = task.id
                }
            }

            const task = {
                "id":maxID + 1,
                "description": description,
                "status": "todo",
                "createdAt": await formatDate(),
                "updatedAt": "not updated yet"
            }
            console.log('Adicionando nova tarefa...')
            await addTasks(task)
            break;

        case "list":
            console.log('Listando tarefas...')
            const listTasks =  await readTask()

            if (listTasks.length === 0){
                console.log('Não há tarefas a serem listadas!')
                break
            }   

            const filter = args[1]
            let listCheckedStatus = null

            switch (filter) {
                case 'todo':
                    tasks = await readTask()
                    listCheckedStatus = []

                    for (let task of tasks){
                        if (task.status === 'todo'){
                            listCheckedStatus.push(task)
                        }
                    }

                    if (listCheckedStatus.length === 0){
                        console.log('Nenhuma tarefa atende aos parametros de busca.')
                        break
                    }
                    
                    console.log('Aqui estão as tarefas marcadas como "todo"')
                    for ( let task of listCheckedStatus){
                        console.log(`
                            ================================================        
                            
                            Tarefa ID ${task.id}    
                            Descrição: ${task.description}
                            Status: ${task.status}
                            Criada em: ${task.createdAt}
                            Atualizada em: ${task.updatedAt}
        
                            ================================================        
                            `)
                    }
                    listCheckedStatus = null
                    
                    break;

                case 'in-progress':
                    tasks = await readTask()
                    listCheckedStatus = []

                    for (let task of tasks){
                        if (task.status === 'in-progress'){
                            listCheckedStatus.push(task)
                        }
                    }

                    if (listCheckedStatus.length === 0){
                        console.log('Nenhuma tarefa atende aos parametros de busca.')
                        break
                    }
                    
                    console.log('Aqui estão as tarefas marcadas como "in-progress"')
                    for ( let task of listCheckedStatus){
                        console.log(`
                            ================================================        
                            
                            Tarefa ID ${task.id}    
                            Descrição: ${task.description}
                            Status: ${task.status}
                            Criada em: ${task.createdAt}
                            Atualizada em: ${task.updatedAt}
                            
                            ================================================        
                            `)
                        }
                    listCheckedStatus = null
                    break;
                    case 'done':
                        tasks = await readTask()
                        listCheckedStatus = []
                            
                        for (let task of tasks){
                            if (task.status === 'done'){
                                listCheckedStatus.push(task)
                            }
                        }
                            
                        if (listCheckedStatus.length === 0){
                            console.log('Nenhuma tarefa atende aos parametros de busca.')
                            break
                        }
                            
                        console.log('Aqui estão as tarefas marcadas como "done"')
                        for ( let task of listCheckedStatus){
                        console.log(`
                            ================================================        
                            
                            Tarefa ID ${task.id}    
                            Descrição: ${task.description}
                            Status: ${task.status}
                            Criada em: ${task.createdAt}
                            Atualizada em: ${task.updatedAt}
        
                            ================================================        
                            `)
                        }
                    break;
                    
                    case undefined:
                        for ( let task of listTasks){
                            console.log(`
                                ================================================        
                                
                                Tarefa ID ${task.id}    
                                Descrição: ${task.description}
                                Status: ${task.status}
                                Criada em: ${task.createdAt}
                                Atualizada em: ${task.updatedAt}
            
                                ================================================        
                                `)
                        }
                    break;

                default:
                    break;
            }

            break;

        case "update":
            test = args[3]

            if (test){
                console.log("Comando invalido: arg description deve estar em aspas simples ou duplas;")
                break
            }

            taskID = Number(args[1])
            if(!Number.isInteger(taskID)){
                console.log('Insira ID de tarefa valido!')
                break
            }

            const taskUpdate = args[2]
            if (!taskUpdate){
                console.log('Empty value not accepted!')
                break
            }

            tasks = await readTask() 
            listIDs = []

            for (let task of tasks){
                listIDs.push(task.id)
                if (task.id === taskID){
                    task.description = taskUpdate
                    task.status = 'todo'
                    task.updatedAt = await formatDate()
                    break
                }
            }

            if (!listIDs.includes(taskID)){
                console.log('ID de tarefa não encontrado.')
                listIDs = null
                break
            }
            
            listIDs = null
            console.log('Atualizando tarefa...')
            await updateTasks(tasks, taskID)
            break;

        case "delete":
            test = args[2]

            if (test){
                console.log("Comando invalido!")
                break
            }

            taskID = Number(args[1])
            if(!Number.isInteger(taskID)){
                console.log('Insira ID de tarefa valido!')
                break
            }

            tasks = await readTask() 
            let newTasks = []
            listIDs = []

            for (let task of tasks){
                listIDs.push(task.id)
                if (task.id !== taskID){
                    newTasks.push(task)
                } else if (task.id === taskID){
                    console.log(`Tarefa de ID ${task.id} encontrada. Deletando...`)
                }
            }

            if (!listIDs.includes(taskID)){
                console.log('ID de tarefa não encontrado.')
                listIDs = null
                break
            }
            listIDs = null
            await deleteTask(newTasks, taskID)
            break;

        case "help":
            if (args[1]){
                console.log('Comando invalido!')
                break
            }

            console.log(`
        Lista de comandos:

        ================================================        
        
        - task-cli add "Task description"
        - task-cli update ID
        - task-cli delete ID
        - task-cli mark-in-progress ID
        - task-cli mark-done ID
        - task-cli list
        - task-cli list done
        - task-cli list todo
        - task-cli list in-progress
        
        ================================================        
            
            `)
            break

        case "mark-in-progress":
            test = args[2]

            if (test){
                console.log("Comando invalido!")
                break
            }

            taskID = Number(args[1])
            if(!Number.isInteger(taskID)){
                console.log('Insira ID de tarefa valido!')
                break
            }

            tasks = await readTask() 
            listIDs = []

            for (let task of tasks){
                listIDs.push(task.id)
                if (task.id === taskID){
                    task.status = 'in-progress'
                    task.updatedAt = await formatDate()
                    break
                }
            }

            if (!listIDs.includes(taskID)){
                console.log('ID de tarefa não encontrado.')
                listIDs = null
                break
            }
            
            listIDs = null
            console.log(`Marcando tarefa ID ${taskID} como "in-progress"...`)
            await updateTasks(tasks, taskID)
            break;
        case "mark-done":

            test = args[2]

            if (test){
                console.log("Comando invalido!")
                break
            }

            taskID = Number(args[1])
            if(!Number.isInteger(taskID)){
                console.log('Insira ID de tarefa valido!')
                break
            }

            tasks = await readTask() 
            listIDs = []

            for (let task of tasks){
                listIDs.push(task.id)
                if (task.id === taskID){
                    task.status = 'done'
                    task.updatedAt = await formatDate()
                    break
                }
            }

            if (!listIDs.includes(taskID)){
                console.log('ID de tarefa não encontrado.')
                listIDs = null
                break
            }
            
            listIDs = null
            console.log(`Marcando tarefa ID ${taskID} como "done"...`)
            await updateTasks(tasks, taskID)

            break

        default:
            console.log(`Comando desconhecido: ${command}`)
            break;
    }
}

handleCommand()