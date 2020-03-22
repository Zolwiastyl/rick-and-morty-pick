1. //GET

1. Axios - installation - DEPREC
1. GET:
   - configure State - not nedded
   - make GET request - done
1. Deploy (Build&Deploy) - DEPREC
1. Backend:
   -GET - done
   -TasksDB - done

II POST

1. Make POST, which will add tasks
2. Handle this POST in darklang:
   - service worker(?)
   - can see the example from SPA tutorial

III DIFFRENT TASK GROUPS:

1. move TasksElement()=>{} to diffrent module
2. expand it to make it accept props as task group taken from GET

~To Do
~Done
~Working on in
~Stuck
~Waiting

Each will take me two days - I hope

so

**NEWTASK:**
update onClick for taskButton - it has to make a dropdown to choose how change state
inspect what onClickTask exactly does.

- 16 GET (configure State, request, deploy)
- 17 GET (Backend)
- 18 POST (make POST) **with** GET - to update tasks
- 19 POST (handle it in darklang)
- 20 GROUPS (move it) **NEWTASK**
- 21 GROUPS (expand it)
- 22 GROUPS (make it render)
  Tasks above done. Now I need to make it look good.

  > > 23 READY

Now Task has only name and status
taskElement renders buttons with the same onClick

**DROP DOWN**

Has to render in position of pointer on left-click
Has to have all categories listed as on option except of the one that task belongs to.
After click on each category it has to move element to another

Is there a point of making task with options like "software element" and categories like:

FUNCTION

with fileds like _arguments_ nad _it should return_
and short description _what it has to do_

**Task category**

- Heading _from prop_
- List of tasks

One task should have:

name label _from prop_
5 buttons for moving to groups and to delete

each button groups has to be defined according to what group is going to use it

interface TaskGroupListProps:{
tasksState : StateProps
buttonGroup : Array<React.FC>
}

const propsForButton = {
tasksState : StateProps.tasks.filter(element => element.name == "to do"),
buttonGroup : filterButtonsArray("to do")
}

function makePropsForButton(status: string){

}
