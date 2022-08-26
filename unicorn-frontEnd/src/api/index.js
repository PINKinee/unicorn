import requires from './require'

export const getElsData = (params) => requires({
    url: '/getElsData',
    data: params,
    method: 'post',
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
});

//获取保存项目列表
export const getSaveList = (username) => requires({
    url: `/getSaveList?username=${username}`,
    method: 'GET'
})

//保存项目
export const saveTemplate = (params) => requires({
    url: '/saveTemplate',
    method: 'POST',
    data: params
})

//获取保存的模板
export const getRecentlySave = (username, productName) => requires({
    url: `/getRecentlySave?username=${username}&productName=${productName}`,
    method: 'GET'
})

//删除项目
export const deleteTemplate = (parmas) => requires({
    method: 'POST',
    data: parmas,
    url: '/deleteTemplate'
})

//修改项目名
export const updateInfo = (username, productName, newName) => requires({
    url: `/updateInfo?username=${username}&productName=${productName}&newName=${newName}`,
    method: 'GET'
})