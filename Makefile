install:
	cd app && yarn

start:
	docker-compose start || docker-compose up -d

stop:
	docker-compose stop

down:
	docker-compose down

logs:
	docker-compose logs -f

spam:
	siege -f fixtures/50.txt

spam-90:
	siege -f fixtures/90.txt

spam-80:
	siege -f fixtures/80.txt

spam-100:
	siege -f fixtures/100.txt

spam-0:
	siege -f fixtures/0.txt
