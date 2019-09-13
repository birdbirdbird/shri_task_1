d=($(ls -d */))
for i in ${!d[*]}
  do
  	if [ $(find ${d[i]} -type d -name ".git" | wc -l) -gt 0 ]
  	then
  		echo ${d[i]%%/}
  	fi
  done

