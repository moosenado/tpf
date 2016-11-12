<!DOCTYPE HTML>
<html>

<head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="theme-color" content="#71e271">
	<meta name="description" content="Easily find a Toronto park closest to you. Filter your search and view park details.">
	<meta name="keywords" content="Toronto,Parks,Near Me,Facilities">
	<meta name="author" content="Moosenado Productions">
	<link href="{{ asset('/css/app.css') }}" rel="stylesheet" type="text/css" >
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
	<link href='https://fonts.googleapis.com/css?family=Archivo+Narrow:400,700italic,700,400italic' rel='stylesheet' type='text/css'>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
	<script src="//cdn.jsdelivr.net/jquery.scrollto/2.1.2/jquery.scrollTo.min.js"></script>
	<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBBI0STCHXt9khuQ4cm68bS-HxqBa_s9ec"
  type="text/javascript"></script>
  	<script id="searchCallback" type="text/javascript" src=""></script>
  	<script>
	  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

	  ga('create', 'UA-86695114-1', 'auto');
	  ga('send', 'pageview');

	</script>
	<meta name="csrf-token" content="{{ csrf_token() }}" />
	<title>Toronto Parks Near Me</title>
</head>

<body>
