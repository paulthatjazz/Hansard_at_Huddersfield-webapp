#Source: Gries, S. T. (2017;2016;). Quantitative corpus linguistics with R: A practical introduction (Second ed.). London, [England];New York, New York;: Routledge. doi:10.4324/9781315746210

rm(list=ls(all=TRUE)) # clear memory
args = commandArgs(trailingOnly=TRUE)

log.0 <- function (some.number, base=exp(1)) { # define a function to compute a log of some number with some base (default: natural log)
   ifelse(some.number==0,              # if the number of which the log is computed is 0,
          0,                           # then return 0,
          log(some.number, base=base)) # otherwise return the log of the non-zero number to the user-defined or default base
}

all.word.tokens <- all.sources <- vector() # generate vectors to store the results

if(args[2]!="null"){
   comparison.word.tokens <- readRDS(file=args[2])
}else{
   text.file <- tolower(scan(file= paste("../../tmp/", args[1], "_comparison.txt", sep=""), what=character(), sep="\n", quiet=TRUE))

   # split up into words (simplistically)
   comparison.word.tokens <- unlist( # create a vector word.tokens by unlisting
      strsplit(text.file,      # the result of splitting up the text file
               "\\W+",         # at occurrences of 1+ non-word characters
               perl=TRUE))     # using Perl-compatible regular expressions
   comparison.word.tokens <- comparison.word.tokens[nzchar(comparison.word.tokens)] # remove empty character strings
   comparison.word.tokens[          # take the current word tokens
      grepl("^\\d+$",         # where you find only of 1 or more digits
            comparison.word.tokens, # in current word tokens
            perl=TRUE)] <-    # using Perl-compatible regular expressions and change them to
      "_NUM_"                 # "_NUM_"
}

all.sources <- c(all.sources, rep( # add to all corpora the repetitions of
   paste(args[1],"_comparison", sep=""), # the name of the current corpus file
   length(comparison.word.tokens)        # as often as that corpus has words
))

if(args[3]!="null"){
   target.word.tokens <- readRDS(file=args[3])
} else{
   text.file <- tolower(scan(file=paste("../../tmp/", args[1], "_target.txt", sep=""), what=character(), sep="\n", quiet=TRUE))
   
   # split up into words (simplistically)
   target.word.tokens <- unlist( # create a vector word.tokens by unlisting
      strsplit(text.file,      # the result of splitting up the text file
               "\\W+",         # at occurrences of 1+ non-word characters
               perl=TRUE))     # using Perl-compatible regular expressions
   target.word.tokens <- target.word.tokens[nzchar(target.word.tokens)] # remove empty character strings
   target.word.tokens[          # take the current word tokens
      grepl("^\\d+$",         # where you find only of 1 or more digits
            target.word.tokens, # in current word tokens
            perl=TRUE)] <-    # using Perl-compatible regular expressions and change them to
      "_NUM_"                 # "_NUM_"

}

all.sources <- c(all.sources, rep( # add to all corpora the repetitions of
       paste(args[1],"_target", sep=""),                    # the name of the current corpus file
      length(target.word.tokens)        # as often as that corpus has words
))


 all.word.tokens <- c(comparison.word.tokens,  # create a new version of all.word.tokens by adding to the old version
                        target.word.tokens) # the current word tokens


word.by.corp.table <- table(all.word.tokens, all.sources) # cross-tabulate the words and the corpora
#head(word.by.corp.table, 20)                              # and check the first 20 rows of that table

# generating vectors for the typical computation of keywords statistics from 2x2 tables
obs.as <- word.by.corp.table[,1] # the individual observed frequencies of each words in the first corpus
obs.bs <- word.by.corp.table[,2] # the individual observed frequencies of each words in the second corpus
obs.cs <- sum(obs.as) - obs.as   # the combined observed frequencies of all other words in the first corpus
obs.ds <- sum(obs.bs) - obs.bs   # the combined observed frequencies of all other words in the second corpus

storage.mode(obs.as) <- "numeric"
storage.mode(obs.bs) <- "numeric"
storage.mode(obs.cs) <- "numeric"
storage.mode(obs.ds) <- "numeric"

exp.as <- (obs.as+obs.bs)*(obs.as+obs.cs)/length(all.word.tokens) # the frequency expected for obs.as if the null hypothesis was true
exp.bs <- (obs.as+obs.bs)*(obs.bs+obs.ds)/length(all.word.tokens) # the frequency expected for obs.bs if the null hypothesis was true
exp.cs <- (obs.as+obs.cs)*(obs.cs+obs.ds)/length(all.word.tokens) # the frequency expected for obs.cs if the null hypothesis was true
exp.ds <- (obs.bs+obs.ds)*(obs.cs+obs.ds)/length(all.word.tokens) # the frequency expected for obs.ds if the null hypothesis was true

# computing log-likelihood ratios for all words
llrs <- 2*(
   obs.as*log.0(obs.as/exp.as)+
   obs.bs*log.0(obs.bs/exp.bs)+
   obs.cs*log.0(obs.cs/exp.cs)+
   obs.ds*log.0(obs.ds/exp.ds)
)

# computing difference coefficients for all words
dcs <- (obs.as-obs.bs)/rowSums(word.by.corp.table)

# computing relative frequency ratios for all words
rfrs <- (obs.as/colSums(word.by.corp.table)[1]) / (obs.bs/colSums(word.by.corp.table)[2])

results <- data.frame(
   WORD=rownames(word.by.corp.table),
   LOGLIKRATIOS=llrs,
   PREFERRED=ifelse(obs.as>obs.bs, "corpus1", "corpus2"),
   row.names=NULL
)


#results <- results[order(results$PREFERRED,     # re-order the rows of the data frame result by which corpus is preferred by each word,
#                         results$LOGLIKRATIOS, # , then by the difference coefficients,
#                        decreasing=TRUE),]     # and all that in descending order


results <- subset(results, PREFERRED == "corpus2", select=c("WORD", "LOGLIKRATIOS"))
results <- results[order(results$LOGLIKRATIOS, # re-order the rows of the data frame result by the difference coefficients,
                         decreasing=TRUE),]     # and all that in descending order

colnames(results) <- c("id","value")
write.table(results[1:100,], paste("../../tmp/", args[1], "_kw.csv", sep=""),     # save the data frame into a file
            sep=",", eol="\n",           # tab-separated and line breaks at the end of rows
            row.names=FALSE, quote=FALSE,fileEncoding = "UTF-8") # no row names and don't put quotes around strings