package org.cirmmp.webmetalclassifier.service.run;

import com.opencsv.CSVWriter;
import com.opencsv.bean.HeaderColumnNameMappingStrategy;
import com.opencsv.bean.HeaderColumnNameMappingStrategyBuilder;
import com.opencsv.bean.StatefulBeanToCsv;
import com.opencsv.bean.StatefulBeanToCsvBuilder;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.cirmmp.webmetalclassifier.model.Job;
import org.cirmmp.webmetalclassifier.model.OutRunCommnad;
import org.cirmmp.webmetalclassifier.model.Submitjsonsingle;
import org.cirmmp.webmetalclassifier.utils.CustomMappingStrategy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.CustomAutowireConfigurer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileWriter;
import java.io.InputStream;
import java.io.Writer;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class RunCommandClassifierImpl implements RunCommandClassifier{

    @Value("${conda.env}")
    private String condaenv;

    @Value("${sh.bin}")
    private String shbin;

    @Value("${condash.env}")
    private String condashenv;

    Logger logger = LoggerFactory.getLogger(RunCommandClassifierImpl.class);
    String generatedString = RandomStringUtils.randomAlphanumeric(10);
    @Autowired
    ResourceLoader resourceLoader;
    @Autowired
    private RunCommand runCommand;

    @Override
    public OutRunCommnad runclassifier(Job job) throws Exception {

        String generatedString = "tmp_"+RandomStringUtils.randomAlphanumeric(10);
        String workdir = job.getDirectory()+ "/"+ generatedString;

        File folder = new File(job.getDirectory());
        if (!folder.exists()) {
            folder.mkdir();
        }

        File workdir_create =  new File(job.getDirectory()+ "/"+ generatedString);
        if (!workdir_create.exists()) {
            workdir_create.mkdir();
        }

        try (Writer writer  = new FileWriter(workdir+"/file.csv")) {

            CustomMappingStrategy<Submitjsonsingle> strategy = new CustomMappingStrategy<>();
            strategy.setType(Submitjsonsingle.class);
            StatefulBeanToCsv<Submitjsonsingle> sbc = new StatefulBeanToCsvBuilder<Submitjsonsingle>(writer)
                    .withMappingStrategy(strategy)
                    .withQuotechar('\'')
                    .withSeparator(CSVWriter.DEFAULT_SEPARATOR)
                    .withApplyQuotesToAll(false)
                    .build();

            sbc.write(job.getSubmitjsonsingles());
        }
        List<String> execFile = Arrays.asList(
                "#!/bin/bash"
                ,"source " + condashenv
                ,"conda activate " + condaenv
                ,"python SavePickle.py file.csv"
                ,"echo 'site,length' > in.csv"
                ,"echo 'out,100' >> in.csv"
                ,"cd .."
                ,"python Classify.py --data_path "+generatedString+" --list_path "+generatedString+"/in.csv "
                //,"rm "+ generatedString + "*"
                //,"rm $0"
        );
        logger.info("Sono in runcommandclassifier");
        logger.info(workdir);
        Resource sevestruct = resourceLoader.getResource("classpath:config/SavePickle.py");
        try (InputStream inputStream = sevestruct.getInputStream()) {
            Files.copy(inputStream, Paths.get(workdir+"/SavePickle.py"), StandardCopyOption.REPLACE_EXISTING);
            IOUtils.closeQuietly(inputStream);
        }

        String exesh = workdir+"/run.sh";

        Path outexesh = Paths.get(exesh);
        try {
            Files.write(outexesh, execFile);
        } catch (Exception e) {
            e.printStackTrace();
        }
        List<String> cmdexe = Arrays.asList(shbin, exesh);
        logger.info(cmdexe.stream().reduce("",(a,b) -> a.concat(b).concat(" ")));
        Map<String,String> env = Collections.EMPTY_MAP;
        //env.put("JAVA_HOME",javahome);
        //env.put("PATH", "$JAVA_HOME/bin;$PATH");
        logger.info("JOB started");
        OutRunCommnad outRunCommnad = runCommand.run(cmdexe, env, new File(workdir));
        return outRunCommnad;
    }
}
