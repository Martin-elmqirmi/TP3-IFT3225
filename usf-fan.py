#encoding=utf-8
from bs4 import BeautifulSoup
import csv


# Fonction qui récupère les données des fichiers html donnés
def get_csv(html):
    pre = html.find('pre')
    return pre.text


# Fonction qui récupère un fichier html et retourne un parser.
def get_fichier(path):
    with open(path, encoding="utf8", errors='ignore') as fichier:
        html = BeautifulSoup(fichier, "html.parser")
        return html


# Fonction qui ecrit le contenu dans un fichier dont le chemin et
# le contenu est mis en arguments
def write_fichier(path, content):
    with open(path, "w") as fichier:
        fichier.write(content)


# Fonction qui prend un fichier sql puis le transforme pour créer
# Un nouveau fichier sql qui permet d'insérer les données du fichier csv
def edit_fichier_csvtosql(pathcsv, pathsql):
    new_content = []
    with open(pathcsv, "r+") as fichiercsv:
        r = csv.reader(fichiercsv, delimiter="\n")
        lines = list(r)
        for line in lines:
            if line != []:
                newline = line[0].split(", ")
                if newline[7] == '':
                    newline[7] = '0'
                if newline[7] != 'MSG':
                    new_content.append([newline[0], newline[1], float(newline[7])])

    with open(pathsql, "w") as fichiersql:
        fichiersql.write("INSERT INTO usf_fan VALUES ")
        i = 0
        for content in new_content:
            content[0] = content[0].replace("'", "''")
            content[1] = content[1].replace("'", "''")
            if i == len(new_content) - 1:
                line = f"('{content[0]}', '{content[1]}', {content[2]});"
            else:
                line = f"('{content[0]}', '{content[1]}', {content[2]}), \n"
            i += 1
            fichiersql.write(line)



# Mes appels pour remplir la base de données du projet 3
html = get_fichier("appendixC.html")
text_csv = get_csv(html)
write_fichier("appendixC.csv", text_csv)
edit_fichier_csvtosql("appendixC.csv", "appendixC.sql")

