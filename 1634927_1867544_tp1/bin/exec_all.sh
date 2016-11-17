#!/bin/bash

# Exemple de script qui exécute tous les algos pour chaque exemplaire et qui
# imprime la taille de l'exemplaire et le temps d'exécution. On peut piper
# la sortie de ce script vers un fichier csv et l'ouvrir avec R ou encore
# python (avec matplotlib) pour faire les graphiques.

for algo in `echo algo1 algo2 algo3`; do
  # Fichier ou se trouves les exemplaires
  for ex in `ls ./ex`; do
    t=""
    t=`timeout 180 ./tp.sh -a $algo -e ./ex/$ex -t`
    if [ "${t}" != "" ]; then
      # Si on a des noms d'exemplaires de la forme testset_n_ne.txt, on peut
      # extraire la taille avec sed (par exemple...)
      taille_ex=`echo $ex | sed 's/^testset_\([0-9]*\)_[0-9]*.txt/\1/'`
      echo $taille_ex,$t
    fi
  done
done

