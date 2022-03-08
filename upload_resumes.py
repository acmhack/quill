from pymongo import MongoClient
from os import listdir, remove
from time import sleep

# take pw from .env file, since we dont like hardcoding passwords
#with open('.env','r') as env:
#	for line in env.readlines():
#		if "DATABASE" in line:
#			pw = line.split("@")[0].split(':')[-1]

client = MongoClient("mongodb://Dev-Test:47yJzDQpYcz5S8U@cluster0-shard-00-00.alesk.mongodb.net:27017,cluster0-shard-00-01.alesk.mongodb.net:27017,cluster0-shard-00-02.alesk.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-z61iuf-shard-0&authSource=admin&retryWrites=true&w=majority")
# "mongodb://Dev-Admin:%s@pickhacks-shard-00-00-alesk.mongodb.net:27017,pickhacks-shard-00-01-alesk.mongodb.net:27017,pickhacks-shard-00-02-alesk.mongodb.net:27017/test?ssl=true&replicaSet=PickHacks-shard-0&authSource=admin&retryWrites=true&w=majority" % pw)
db = client.test

while True:
	resumes = listdir('/resumes')
	if len(resumes)<1:
		sleep(10)
		continue

	for resume in resumes:
		id = resume.split('.')[0]
		sleep(5) # lazy way to make sure its done uploading
		for user in db.users.find():
			if str(user['_id']) in id:
				r = open('/resumes/' + resume, 'rb').read()
				db.users.update({'_id':user['_id']},{'$set':{'resume':r}})
				remove('/resumes/' + resume)

	sleep(1)




