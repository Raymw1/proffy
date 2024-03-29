module.exports = async function(db, {proffyValue, classValue, classScheduleValues }) {
    // AWAIT == .then()
    const insertedProffy = await db.run(`
        INSERT INTO proffys (name, avatar, whatsapp, bio) 
        VALUES ("${proffyValue.name}", "${proffyValue.avatar}", "${proffyValue.whatsapp}", "${proffyValue.bio}");
    `);

    const proffyId = insertedProffy.lastID;

    const insertedClass= await db.run(`
        INSERT INTO classes (subject, cost, proffy_id) 
        VALUES ("${classValue.subject}", "${classValue.cost}", ${proffyId});
    `);

    const classId = insertedClass.lastID;

    const insertedAllClassScheduleValues = classScheduleValues.map((classScheduleValue) => {
        return db.run(`
            INSERT INTO class_schedule (class_id, weekday, time_from, time_to) 
            VALUES (${classId}, ${classScheduleValue.weekday}, ${classScheduleValue.time_from}, ${classScheduleValue.time_to});
        `);
    });

    await Promise.all(insertedAllClassScheduleValues)
}