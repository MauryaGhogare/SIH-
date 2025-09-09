let commands = { pump: "OFF", led: "OFF" };

export const getData=(req,res)=>{
    res.json(sensorData);
}

export const postData=(req,res)=>{
    let sensorData = req.body;
    console.log("Received Sensor Data:", sensorData);
    res.json({ status: "success", message: "Data received" });
}

export const getCommand=(req,res)=>{
    res.json(commands);
}

export const postCommand=(req,res)=>{
    commands = { ...commands, ...req.body };
    console.log("Received Command:", commands);
    res.json({ status: "success", message: "Command received" });
}