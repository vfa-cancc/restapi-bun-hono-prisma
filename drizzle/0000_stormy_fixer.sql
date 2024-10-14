
CREATE TABLE `posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` varchar(191),
	`createdAt` datetime(3) NOT NULL DEFAULT (now(3)),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullname` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`role` enum('ROOT','ADMIN','USER') NOT NULL DEFAULT 'USER',
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
